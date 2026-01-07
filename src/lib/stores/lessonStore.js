import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Get initial lesson progress from localStorage
 */
function getInitialProgress() {
	if (!browser) return {};
	
	try {
		const stored = localStorage.getItem('lessonProgress');
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
		const stored = localStorage.getItem('totalXP');
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
		const stored = localStorage.getItem('streak');
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
		const stored = localStorage.getItem('lastActiveDate');
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
			localStorage.setItem('lessonProgress', JSON.stringify(value));
		} catch (e) {
			console.error('Error saving lesson progress:', e);
		}
	});

	totalXP.subscribe(value => {
		try {
			localStorage.setItem('totalXP', value.toString());
		} catch (e) {
			console.error('Error saving XP:', e);
		}
	});

	streak.subscribe(value => {
		try {
			localStorage.setItem('streak', value.toString());
		} catch (e) {
			console.error('Error saving streak:', e);
		}
	});

	lastActiveDate.subscribe(value => {
		try {
			if (value) {
				localStorage.setItem('lastActiveDate', value);
			} else {
				localStorage.removeItem('lastActiveDate');
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
		totalXP.update(xp => xp + xpReward);
	}

	// Update streak
	updateStreak();
}

/**
 * Update streak based on current date
 */
function updateStreak() {
	if (!browser) return;

	const today = new Date().toISOString().split('T')[0];
	let lastDate;
	let currentStreak;

	lastActiveDate.subscribe(date => lastDate = date)();
	streak.subscribe(s => currentStreak = s)();

	if (!lastDate) {
		// First time
		streak.set(1);
		lastActiveDate.set(today);
	} else if (lastDate === today) {
		// Already active today, no change
		return;
	} else {
		// Check if it's consecutive
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayStr = yesterday.toISOString().split('T')[0];

		if (lastDate === yesterdayStr) {
			// Consecutive day
			streak.update(s => s + 1);
		} else {
			// Streak broken
			streak.set(1);
		}
		lastActiveDate.set(today);
	}
}

/**
 * Check if a lesson is completed
 * @param {string} lang - Language code
 * @param {number} lessonId - Lesson ID
 * @returns {boolean} True if completed
 */
export function isLessonCompleted(lang, lessonId) {
	let completed = false;
	lessonProgress.subscribe(progress => {
		completed = progress[lang]?.includes(lessonId) || false;
	})();
	return completed;
}

/**
 * Get completion count for a language
 * @param {string} lang - Language code
 * @returns {number} Number of completed lessons
 */
export function getCompletedCount(lang) {
	let count = 0;
	lessonProgress.subscribe(progress => {
		count = progress[lang]?.length || 0;
	})();
	return count;
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
		localStorage.removeItem('lessonProgress');
		localStorage.removeItem('totalXP');
		localStorage.removeItem('streak');
		localStorage.removeItem('lastActiveDate');
	}
}
