import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { STORAGE_KEYS } from '$lib/utils/constants.js';

// Import sync trigger (lazy to avoid circular dependency)
let triggerAutoSync;
if (browser) {
	import('./syncStore.js').then(module => {
		triggerAutoSync = module.triggerAutoSync;
	});
}

/**
 * Get initial lesson progress from localStorage
 */
function getInitialProgress() {
	if (!browser) return {};
	
	try {
		const stored = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
		return stored ? JSON.parse(stored) : {};
	} catch (e) {
		console.error('Error loading lesson progress:', e);
		return {};
	}
}

/**
 * Get initial XP from localStorage
 */
function getInitialXP() {
	if (!browser) return 0;
	
	try {
		const stored = localStorage.getItem(STORAGE_KEYS.TOTAL_XP);
		return stored ? parseInt(stored, 10) : 0;
	} catch (e) {
		console.error('Error loading XP:', e);
		return 0;
	}
}

/**
 * Get initial streak from localStorage
 */
function getInitialStreak() {
	if (!browser) return 0;
	
	try {
		const stored = localStorage.getItem(STORAGE_KEYS.STREAK);
		return stored ? parseInt(stored, 10) : 0;
	} catch (e) {
		console.error('Error loading streak:', e);
		return 0;
	}
}

/**
 * Get last active date from localStorage
 */
function getLastActiveDate() {
	if (!browser) return null;
	
	try {
		const stored = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
		return stored || null;
	} catch (e) {
		console.error('Error loading last active date:', e);
		return null;
	}
}

/**
 * Lesson progress store
 * Tracks completed lessons per language
 */
export const lessonProgress = writable(getInitialProgress());

/**
 * Total XP store
 */
export const totalXP = writable(getInitialXP());

/**
 * Streak store
 */
export const streak = writable(getInitialStreak());

/**
 * Last active date store
 */
export const lastActiveDate = writable(getLastActiveDate());

/**
 * Subscribe to changes and persist to localStorage
 */
if (browser) {
	lessonProgress.subscribe(value => {
		try {
			localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(value));
			// Trigger auto-sync when progress changes
			if (triggerAutoSync) {
				triggerAutoSync();
			}
		} catch (e) {
			console.error('Error saving lesson progress:', e);
		}
	});

	totalXP.subscribe(value => {
		try {
			localStorage.setItem(STORAGE_KEYS.TOTAL_XP, value.toString());
			// Trigger auto-sync when XP changes
			if (triggerAutoSync) {
				triggerAutoSync();
			}
		} catch (e) {
			console.error('Error saving XP:', e);
		}
	});

	streak.subscribe(value => {
		try {
			localStorage.setItem(STORAGE_KEYS.STREAK, value.toString());
			// Trigger auto-sync when streak changes
			if (triggerAutoSync) {
				triggerAutoSync();
			}
		} catch (e) {
			console.error('Error saving streak:', e);
		}
	});

	lastActiveDate.subscribe(value => {
		try {
			if (value) {
				localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, value);
			} else {
				localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
			}
		} catch (e) {
			console.error('Error saving last active date:', e);
		}
	});
}

/**
 * Mark a lesson as completed
 * @param {string} lang - Language code
 * @param {number} lessonId - Lesson ID
 * @param {number} xpReward - XP to award
 */
export function completeLesson(lang, lessonId, xpReward = 0) {
	lessonProgress.update(progress => {
		if (!progress[lang]) {
			progress[lang] = [];
		}
		if (!progress[lang].includes(lessonId)) {
			progress[lang].push(lessonId);
		}
		return progress;
	});

	if (xpReward > 0) {
		addXP(xpReward);
	}

	// Update streak
	updateStreak();
	
	// Check for achievements
	import('./achievementStore.js').then(({ checkAchievements }) => {
		checkAchievements();
	});
}

/**
 * Update streak based on last active date
 * Called whenever user completes a lesson or quiz
 */
export function updateStreak() {
	if (!browser) return;

	const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
	const last = get(lastActiveDate);

	if (last === today) {
		// Already active today, no change
		return;
	}

	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayStr = yesterday.toISOString().split('T')[0];

	let currentStreak = get(streak);

	if (last === yesterdayStr) {
		// Active yesterday, increment streak
		currentStreak += 1;
	} else if (last === null || last === '') {
		// First time or no previous activity
		currentStreak = 1;
	} else {
		// Missed a day, reset streak
		currentStreak = 1;
	}

	streak.set(currentStreak);
	lastActiveDate.set(today);

	// Persist
	try {
		localStorage.setItem(STORAGE_KEYS.STREAK, currentStreak.toString());
		localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, today);
	} catch (e) {
		console.error('Error saving streak:', e);
	}

	// Trigger auto-sync if authenticated
	if (triggerAutoSync) {
		triggerAutoSync();
	}
}

/**
 * Check if a lesson is completed
 * @param {string} lang - Language code
 * @param {number} lessonId - Lesson ID
 * @returns {boolean} True if completed
 */
export function isLessonCompleted(lang, lessonId) {
	const progress = get(lessonProgress);
	return progress[lang]?.includes(lessonId) || false;
}

/**
 * Get completion count for a language
 * @param {string} lang - Language code
 * @returns {number} Number of completed lessons
 */
export function getCompletedCount(lang) {
	const progress = get(lessonProgress);
	return progress[lang]?.length || 0;
}

/**
 * Add XP to user's total
 * @param {number} amount - XP amount to add
 */
export function addXP(amount) {
	if (!browser || typeof amount !== 'number' || amount <= 0) return;

	totalXP.update(current => {
		const newTotal = current + amount;
		
		// Persist to localStorage
		try {
			localStorage.setItem(STORAGE_KEYS.TOTAL_XP, newTotal.toString());
		} catch (e) {
			console.error('Error saving XP:', e);
		}

		// Trigger sync
		if (triggerAutoSync) {
			triggerAutoSync();
		}

		return newTotal;
	});
}

/**
 * Reset all progress (for testing)
 */
export function resetProgress() {
	lessonProgress.set({});
	totalXP.set(0);
	streak.set(0);
	lastActiveDate.set(null);
	if (browser) {
		localStorage.removeItem(STORAGE_KEYS.LESSON_PROGRESS);
		localStorage.removeItem(STORAGE_KEYS.TOTAL_XP);
		localStorage.removeItem(STORAGE_KEYS.STREAK);
		localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
	}
}
