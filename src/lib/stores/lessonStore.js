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
 * Lesson progress store
 * Tracks completed lessons per language
 */
export const lessonProgress = writable(getInitialProgress());

/**
 * Total XP store
 */
export const totalXP = writable(getInitialXP());

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
	if (browser) {
		localStorage.removeItem('lessonProgress');
		localStorage.removeItem('totalXP');
	}
}
