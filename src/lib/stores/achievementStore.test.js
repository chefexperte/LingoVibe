import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	unlockedAchievements,
	checkAchievements,
	recentAchievements,
	initAchievementStore
} from './achievementStore.js';
import { totalXP, streak } from './lessonStore.js';

// Mock localStorage
vi.stubGlobal('localStorage', {
	data: {},
	getItem(key) {
		return this.data[key] || null;
	},
	setItem(key, value) {
		this.data[key] = value;
	},
	removeItem(key) {
		delete this.data[key];
	},
	clear() {
		this.data = {};
	}
});

describe('achievementStore', () => {
	beforeEach(() => {
		localStorage.clear();
		unlockedAchievements.set([]);
		totalXP.set(0);
		streak.set(0);
	});

	describe('checkAchievements', () => {
		it('should unlock "First Steps" achievement after first lesson', () => {
			// Simulate completing first lesson
			localStorage.setItem('lessonProgress', JSON.stringify({ ru: [1] }));
			
			checkAchievements();

			const unlocked = get(unlockedAchievements);
			expect(unlocked).toContain('first_steps');
		});

		it('should unlock "XP Hunter" at 500 XP', () => {
			totalXP.set(500);
			
			checkAchievements();

			const unlocked = get(unlockedAchievements);
			expect(unlocked).toContain('xp_hunter');
		});

		it('should unlock "Week Warrior" at 7-day streak', () => {
			streak.set(7);
			
			checkAchievements();

			const unlocked = get(unlockedAchievements);
			expect(unlocked).toContain('week_warrior');
		});

		it('should not unlock same achievement twice', () => {
			totalXP.set(500);
			
			checkAchievements();
			checkAchievements();

			const unlocked = get(unlockedAchievements);
			const count = unlocked.filter(id => id === 'xp_hunter').length;
			expect(count).toBe(1);
		});
	});

	describe('recentAchievements', () => {
		it('should return last 3 unlocked achievements', () => {
			unlockedAchievements.set(['first_steps', 'quiz_master', 'week_warrior', 'xp_hunter']);

			const recent = get(recentAchievements);
			expect(recent.length).toBe(3);
			expect(recent[0].id).toBe('xp_hunter'); // Most recent first
		});

		it('should return all achievements if less than 3', () => {
			unlockedAchievements.set(['first_steps', 'quiz_master']);

			const recent = get(recentAchievements);
			expect(recent.length).toBe(2);
		});
	});

	describe('persistence', () => {
		it('should save unlocked achievements to localStorage', () => {
			totalXP.set(500);
			checkAchievements();

			const stored = localStorage.getItem('achievements');
			expect(stored).toBeTruthy();
			const parsed = JSON.parse(stored);
			expect(parsed).toContain('xp_hunter');
		});

		it('should load achievements from localStorage on init', () => {
			const testData = ['first_steps', 'quiz_master'];
			localStorage.setItem('achievements', JSON.stringify(testData));

			initAchievementStore();

			const unlocked = get(unlockedAchievements);
			expect(unlocked).toEqual(testData);
		});
	});
});
