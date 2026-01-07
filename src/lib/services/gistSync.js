/**
 * GitHub Gist Sync Service
 * Handles syncing user data to/from GitHub Gists
 */

import { browser } from '$app/environment';
import { getAccessToken } from './githubAuth.js';

const GIST_NAME = 'lingovibe-progress.json';
const GIST_DESCRIPTION = 'Your LingoVibe language learning progress';
const SCHEMA_VERSION = '1.0';

let gistId = null;
let lastSyncTimestamp = null;
let syncInProgress = false;

/**
 * Initialize Gist ID from localStorage
 */
function initGistId() {
	if (!browser) return null;
	try {
		const stored = localStorage.getItem('lingovibe_gist_id');
		if (stored) {
			gistId = stored;
		}
		return gistId;
	} catch (e) {
		console.error('Error loading Gist ID:', e);
		return null;
	}
}

/**
 * Store Gist ID to localStorage
 * @param {string} id - Gist ID to store
 */
function storeGistId(id) {
	if (!browser) return;
	try {
		gistId = id;
		localStorage.setItem('lingovibe_gist_id', id);
	} catch (e) {
		console.error('Error storing Gist ID:', e);
	}
}

/**
 * Clear stored Gist ID
 */
function clearGistId() {
	if (!browser) return;
	try {
		gistId = null;
		localStorage.removeItem('lingovibe_gist_id');
	} catch (e) {
		console.error('Error clearing Gist ID:', e);
	}
}

/**
 * Create data structure for Gist storage
 * @param {Object} user - User data
 * @param {Object} progress - Lesson progress
 * @param {number} totalXP - Total XP
 * @param {number} streak - Current streak
 * @param {string} lastActivity - Last activity date
 * @returns {Object} Formatted data for Gist
 */
export function createGistData(user, progress, totalXP, streak, lastActivity) {
	return {
		schemaVersion: SCHEMA_VERSION,
		lastUpdated: new Date().toISOString(),
		user: {
			username: user?.username || 'anonymous',
			createdAt: user?.createdAt || new Date().toISOString()
		},
		progress: {
			completedLessons: progress || {},
			totalXP: totalXP || 0,
			streak: streak || 0,
			lastActivity: lastActivity || null
		},
		preferences: {
			selectedLanguage: user?.preferences?.selectedLanguage || null,
			difficulty: user?.preferences?.difficulty || 'common',
			dailyGoal: user?.preferences?.dailyGoal || 50
		}
	};
}

/**
 * Find LingoVibe Gist for the authenticated user
 * @returns {Promise<string|null>} Gist ID or null if not found
 */
export async function findLingoVibeGist() {
	const token = getAccessToken();
	if (!token) {
		throw new Error('Not authenticated');
	}
	
	// Check if we have a cached Gist ID
	if (!gistId) {
		initGistId();
	}
	
	// If we have a cached ID, verify it exists
	if (gistId) {
		try {
			const response = await fetch(`https://api.github.com/gists/${gistId}`, {
				headers: {
					'Authorization': `token ${token}`,
					'Accept': 'application/vnd.github.v3+json'
				}
			});
			
			if (response.ok) {
				return gistId;
			} else {
				// Cached ID is invalid, clear it
				clearGistId();
			}
		} catch (e) {
			console.error('Error verifying cached Gist:', e);
			clearGistId();
		}
	}
	
	// Search for LingoVibe Gist
	try {
		const response = await fetch('https://api.github.com/gists', {
			headers: {
				'Authorization': `token ${token}`,
				'Accept': 'application/vnd.github.v3+json'
			}
		});
		
		if (!response.ok) {
			throw new Error(`Failed to fetch Gists: ${response.status}`);
		}
		
		const gists = await response.json();
		const lingoVibeGist = gists.find(g => 
			g.files[GIST_NAME] && g.description === GIST_DESCRIPTION
		);
		
		if (lingoVibeGist) {
			storeGistId(lingoVibeGist.id);
			return lingoVibeGist.id;
		}
		
		return null;
	} catch (error) {
		console.error('Error finding LingoVibe Gist:', error);
		throw error;
	}
}

/**
 * Create a new LingoVibe Gist
 * @param {Object} data - Data to store in Gist
 * @returns {Promise<string>} Created Gist ID
 */
export async function createLingoVibeGist(data) {
	const token = getAccessToken();
	if (!token) {
		throw new Error('Not authenticated');
	}
	
	try {
		const response = await fetch('https://api.github.com/gists', {
			method: 'POST',
			headers: {
				'Authorization': `token ${token}`,
				'Accept': 'application/vnd.github.v3+json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				description: GIST_DESCRIPTION,
				public: false,
				files: {
					[GIST_NAME]: {
						content: JSON.stringify(data, null, 2)
					}
				}
			})
		});
		
		if (!response.ok) {
			const error = await response.json();
			throw new Error(`Failed to create Gist: ${error.message || response.status}`);
		}
		
		const gist = await response.json();
		storeGistId(gist.id);
		lastSyncTimestamp = new Date().toISOString();
		
		console.log('✓ Created LingoVibe Gist:', gist.id);
		return gist.id;
	} catch (error) {
		console.error('Error creating LingoVibe Gist:', error);
		throw error;
	}
}

/**
 * Fetch data from LingoVibe Gist
 * @returns {Promise<Object|null>} Gist data or null
 */
export async function fetchFromGist() {
	const token = getAccessToken();
	if (!token) {
		throw new Error('Not authenticated');
	}
	
	try {
		const gistId = await findLingoVibeGist();
		if (!gistId) {
			return null;
		}
		
		const response = await fetch(`https://api.github.com/gists/${gistId}`, {
			headers: {
				'Authorization': `token ${token}`,
				'Accept': 'application/vnd.github.v3+json'
			}
		});
		
		if (!response.ok) {
			throw new Error(`Failed to fetch Gist: ${response.status}`);
		}
		
		const gist = await response.json();
		const fileContent = gist.files[GIST_NAME]?.content;
		
		if (!fileContent) {
			throw new Error('Gist file not found');
		}
		
		const data = JSON.parse(fileContent);
		lastSyncTimestamp = data.lastUpdated;
		
		console.log('✓ Fetched data from Gist');
		return data;
	} catch (error) {
		console.error('Error fetching from Gist:', error);
		throw error;
	}
}

/**
 * Update LingoVibe Gist with new data
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export async function updateGist(data) {
	const token = getAccessToken();
	if (!token) {
		throw new Error('Not authenticated');
	}
	
	try {
		let gistIdToUpdate = await findLingoVibeGist();
		
		// If no Gist exists, create one
		if (!gistIdToUpdate) {
			await createLingoVibeGist(data);
			return;
		}
		
		const response = await fetch(`https://api.github.com/gists/${gistIdToUpdate}`, {
			method: 'PATCH',
			headers: {
				'Authorization': `token ${token}`,
				'Accept': 'application/vnd.github.v3+json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				files: {
					[GIST_NAME]: {
						content: JSON.stringify(data, null, 2)
					}
				}
			})
		});
		
		if (!response.ok) {
			const error = await response.json();
			throw new Error(`Failed to update Gist: ${error.message || response.status}`);
		}
		
		lastSyncTimestamp = new Date().toISOString();
		console.log('✓ Updated Gist');
	} catch (error) {
		console.error('Error updating Gist:', error);
		throw error;
	}
}

/**
 * Delete LingoVibe Gist
 * @returns {Promise<void>}
 */
export async function deleteGist() {
	const token = getAccessToken();
	if (!token) {
		throw new Error('Not authenticated');
	}
	
	try {
		const gistIdToDelete = await findLingoVibeGist();
		if (!gistIdToDelete) {
			console.log('No Gist to delete');
			return;
		}
		
		const response = await fetch(`https://api.github.com/gists/${gistIdToDelete}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `token ${token}`,
				'Accept': 'application/vnd.github.v3+json'
			}
		});
		
		if (!response.ok && response.status !== 404) {
			throw new Error(`Failed to delete Gist: ${response.status}`);
		}
		
		clearGistId();
		lastSyncTimestamp = null;
		console.log('✓ Deleted Gist');
	} catch (error) {
		console.error('Error deleting Gist:', error);
		throw error;
	}
}

/**
 * Sync local data with Gist
 * Implements the merge strategy: most recent data wins
 * 
 * @param {Object} localData - Local user data
 * @returns {Promise<Object>} Result of sync operation
 */
export async function syncWithGist(localData) {
	if (syncInProgress) {
		console.log('Sync already in progress, skipping');
		return { status: 'skipped', reason: 'Sync in progress' };
	}
	
	syncInProgress = true;
	
	try {
		const gistData = await fetchFromGist();
		
		if (!gistData) {
			// No Gist exists - upload local data
			await createLingoVibeGist(localData);
			return { 
				status: 'uploaded', 
				message: 'Your progress has been backed up to GitHub!',
				data: localData
			};
		}
		
		const localTimestamp = new Date(localData.lastUpdated || 0);
		const gistTimestamp = new Date(gistData.lastUpdated || 0);
		
		if (localTimestamp > gistTimestamp) {
			// Local is newer - push to cloud
			await updateGist(localData);
			return { 
				status: 'pushed', 
				message: 'Synced to cloud',
				data: localData
			};
		} else if (gistTimestamp > localTimestamp) {
			// Cloud is newer - pull from cloud
			return { 
				status: 'pulled', 
				message: 'Restored from cloud',
				data: gistData
			};
		} else {
			// Already in sync
			return { 
				status: 'synced', 
				message: 'Already up to date',
				data: localData
			};
		}
	} catch (error) {
		console.error('Sync error:', error);
		return { 
			status: 'error', 
			message: error.message,
			error: error
		};
	} finally {
		syncInProgress = false;
	}
}

/**
 * Get last sync timestamp
 * @returns {string|null} Last sync timestamp
 */
export function getLastSyncTime() {
	return lastSyncTimestamp;
}

/**
 * Check if sync is currently in progress
 * @returns {boolean} True if syncing
 */
export function isSyncing() {
	return syncInProgress;
}
