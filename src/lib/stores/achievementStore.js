import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { ACHIEVEMENTS } from '$lib/utils/achievements.js';
import { STORAGE_KEYS } from '$lib/utils/constants.js';
import { totalXP, streak } from './lessonStore.js';

/**
 * Unlocked achievement IDs
 */
export const unlockedAchievements = writable([]);

/**
 * Recently unlocked achievements (for showing popup)
 */
export const recentlyUnlocked = writable(null);

/**
 * Initialize achievement store
 */
export function initAchievementStore() {
	if (!browser) return;

	try {
		const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
		if (stored) {
			unlockedAchievements.set(JSON.parse(stored));
		}
	} catch (e) {
		console.error('Error loading achievements:', e);
	}
}

/**
 * Get user stats for achievement checking
 */
function getUserStats() {
	const $totalXP = get(totalXP);
	const $streak = get(streak);

	// Count lessons from localStorage
	let lessonsCompleted = 0;
	try {
		const progress = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS) || '{}');
		lessonsCompleted = Object.values(progress).flat().length;
	} catch (e) {
		console.error('Error reading lesson progress:', e);
	}

	// Count perfect quizzes and total quizzes
	let perfectQuizzes = 0;
	let quizzesCompleted = 0;
	try {
		const quizHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY) || '[]');
		perfectQuizzes = quizHistory.filter(q => q.accuracy === 100).length;
		quizzesCompleted = quizHistory.length;
	} catch (e) {
		console.error('Error reading quiz history:', e);
	}

	return {
		totalXP: $totalXP,
		streak: $streak,
		lessonsCompleted,
		perfectQuizzes,
		quizzesCompleted
	};
}

/**
 * Check all achievements and unlock new ones
 */
export function checkAchievements() {
	if (!browser) return;

	const stats = getUserStats();
	const unlocked = get(unlockedAchievements);
	const newlyUnlocked = [];

	ACHIEVEMENTS.forEach(achievement => {
		// Skip if already unlocked
		if (unlocked.includes(achievement.id)) return;

		// Check condition
		if (achievement.condition(stats)) {
			newlyUnlocked.push(achievement);
		}
	});

	if (newlyUnlocked.length > 0) {
		// Update unlocked list
		const updatedUnlocked = [...unlocked, ...newlyUnlocked.map(a => a.id)];
		unlockedAchievements.set(updatedUnlocked);

		// Persist
		try {
			localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updatedUnlocked));
		} catch (e) {
			console.error('Error saving achievements:', e);
		}

		// Award XP bonus for each achievement
		// Import addXP dynamically to avoid circular dependency
		import('./lessonStore.js').then(({ addXP }) => {
			newlyUnlocked.forEach(achievement => {
				addXP(achievement.xpBonus);
			});
		});

		// Show popup for first newly unlocked
		recentlyUnlocked.set(newlyUnlocked[0]);

		// Clear popup after 5 seconds
		setTimeout(() => {
			recentlyUnlocked.set(null);
		}, 5000);
	}
}

/**
 * Get achievement progress (0-1)
 */
export function getAchievementProgress(achievementId) {
	const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
	if (!achievement) return 0;

	const stats = getUserStats();
	
	// Simple estimation - this can be improved per achievement
	// For now, just return 0 or 1
	return achievement.condition(stats) ? 1 : 0;
}

/**
 * Derived store - recent achievements (last 3)
 */
export const recentAchievements = derived(
	unlockedAchievements,
	$unlocked => {
		return ACHIEVEMENTS
			.filter(a => $unlocked.includes(a.id))
			.slice(-3)
			.reverse();
	}
);
