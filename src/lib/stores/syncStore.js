/**
 * Sync Store
 * Manages synchronization state and operations
 */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { isAuthenticated, getGithubUser } from '$lib/services/githubAuth.js';
import { syncWithGist, createGistData, getLastSyncTime } from '$lib/services/gistSync.js';
import { user } from './userStore.js';
import { lessonProgress, totalXP, streak, lastActiveDate } from './lessonStore.js';

/**
 * Sync status: 'idle' | 'syncing' | 'synced' | 'error' | 'offline'
 */
export const syncStatus = writable('idle');

/**
 * Last sync timestamp
 */
export const lastSync = writable(null);

/**
 * Sync error message
 */
export const syncError = writable(null);

/**
 * Number of successful syncs
 */
export const syncCount = writable(0);

/**
 * GitHub user info
 */
export const githubUser = writable(null);

/**
 * Derived store - is user logged in with GitHub
 */
export const isGithubAuthenticated = derived(
	githubUser,
	$githubUser => $githubUser !== null
);

/**
 * Pending sync operations queue
 */
let syncQueue = [];
let syncTimeout = null;
const SYNC_DEBOUNCE_MS = 2000; // Wait 2 seconds before syncing

/**
 * Initialize sync store
 */
export function initSyncStore() {
	if (!browser) return;
	
	// Load GitHub user if authenticated
	if (isAuthenticated()) {
		const storedUser = getGithubUser();
		if (storedUser) {
			githubUser.set(storedUser);
		}
	}
	
	// Load sync stats
	try {
		const storedCount = localStorage.getItem('sync_count');
		if (storedCount) {
			syncCount.set(parseInt(storedCount, 10));
		}
		
		const storedLastSync = localStorage.getItem('last_sync');
		if (storedLastSync) {
			lastSync.set(storedLastSync);
		}
	} catch (e) {
		console.error('Error loading sync stats:', e);
	}
	
	// Check online status
	updateOnlineStatus();
	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);
}

/**
 * Update online/offline status
 */
function updateOnlineStatus() {
	if (!browser) return;
	
	if (!navigator.onLine) {
		syncStatus.set('offline');
	} else if (get(syncStatus) === 'offline') {
		syncStatus.set('idle');
		// Retry pending syncs
		processSyncQueue();
	}
}

/**
 * Get current local data for syncing
 * @returns {Object} Current local data
 */
function getCurrentLocalData() {
	const userData = get(user);
	const progress = get(lessonProgress);
	const xp = get(totalXP);
	const currentStreak = get(streak);
	const lastActivity = get(lastActiveDate);
	
	return createGistData(userData, progress, xp, currentStreak, lastActivity);
}

/**
 * Perform sync operation
 * @param {boolean} manual - Is this a manual sync?
 * @returns {Promise<Object>} Sync result
 */
export async function performSync(manual = false) {
	if (!isAuthenticated()) {
		console.log('Not authenticated, skipping sync');
		return { status: 'skipped', reason: 'Not authenticated' };
	}
	
	if (!navigator.onLine) {
		console.log('Offline, queueing sync');
		queueSync();
		return { status: 'queued', reason: 'Offline' };
	}
	
	syncStatus.set('syncing');
	syncError.set(null);
	
	try {
		const localData = getCurrentLocalData();
		const result = await syncWithGist(localData);
		
		if (result.status === 'error') {
			syncStatus.set('error');
			syncError.set(result.message);
			return result;
		}
		
		// If we pulled newer data from cloud, update local stores
		if (result.status === 'pulled' && result.data) {
			applyCloudData(result.data);
		}
		
		// Update sync stats
		syncStatus.set('synced');
		const now = new Date().toISOString();
		lastSync.set(now);
		
		if (browser) {
			localStorage.setItem('last_sync', now);
		}
		
		// Increment sync count
		syncCount.update(count => {
			const newCount = count + 1;
			if (browser) {
				localStorage.setItem('sync_count', newCount.toString());
			}
			return newCount;
		});
		
		// Show user-friendly message
		if (manual) {
			console.log(`✓ ${result.message}`);
		}
		
		// Reset to idle after 3 seconds
		setTimeout(() => {
			if (get(syncStatus) === 'synced') {
				syncStatus.set('idle');
			}
		}, 3000);
		
		return result;
	} catch (error) {
		console.error('Sync failed:', error);
		syncStatus.set('error');
		syncError.set(error.message);
		
		// Queue for retry
		queueSync();
		
		return { status: 'error', message: error.message };
	}
}

/**
 * Apply cloud data to local stores
 * @param {Object} cloudData - Data from cloud
 */
function applyCloudData(cloudData) {
	if (!cloudData) return;
	
	try {
		// Update user data
		if (cloudData.user) {
			user.update(currentUser => ({
				...currentUser,
				username: cloudData.user.username,
				createdAt: cloudData.user.createdAt,
				preferences: cloudData.preferences || currentUser?.preferences
			}));
		}
		
		// Update progress
		if (cloudData.progress) {
			if (cloudData.progress.completedLessons) {
				lessonProgress.set(cloudData.progress.completedLessons);
			}
			if (cloudData.progress.totalXP !== undefined) {
				totalXP.set(cloudData.progress.totalXP);
			}
			if (cloudData.progress.streak !== undefined) {
				streak.set(cloudData.progress.streak);
			}
			if (cloudData.progress.lastActivity) {
				lastActiveDate.set(cloudData.progress.lastActivity);
			}
		}
		
		console.log('✓ Applied cloud data to local stores');
	} catch (error) {
		console.error('Error applying cloud data:', error);
	}
}

/**
 * Queue sync operation
 */
function queueSync() {
	// Clear existing timeout
	if (syncTimeout) {
		clearTimeout(syncTimeout);
	}
	
	// Set new timeout
	syncTimeout = setTimeout(() => {
		processSyncQueue();
	}, SYNC_DEBOUNCE_MS);
}

/**
 * Process queued sync operations
 */
async function processSyncQueue() {
	if (!navigator.onLine || !isAuthenticated()) {
		return;
	}
	
	if (get(syncStatus) === 'syncing') {
		// Already syncing, will retry later
		return;
	}
	
	await performSync(false);
}

/**
 * Trigger automatic sync (debounced)
 * Called when user data changes
 */
export function triggerAutoSync() {
	if (!isAuthenticated()) {
		return;
	}
	
	queueSync();
}

/**
 * Manual sync - immediate
 * @returns {Promise<Object>} Sync result
 */
export function manualSync() {
	return performSync(true);
}

/**
 * Reset sync state
 */
export function resetSyncState() {
	syncStatus.set('idle');
	lastSync.set(null);
	syncError.set(null);
	syncCount.set(0);
	githubUser.set(null);
	
	if (browser) {
		localStorage.removeItem('sync_count');
		localStorage.removeItem('last_sync');
	}
}

// Initialize on module load
if (browser) {
	initSyncStore();
}
