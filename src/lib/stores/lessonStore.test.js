import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	lessonProgress,
	totalXP,
	streak,
	lastActiveDate,
	completeLesson,
	isLessonCompleted,
	getCompletedCount,
	resetProgress
} from './lessonStore.js';

// Mock browser environment
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

describe('lessonStore', () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();
		resetProgress();
	});

	afterEach(() => {
		localStorage.clear();
	});

	describe('completeLesson', () => {
		it('should mark a lesson as completed', () => {
			completeLesson('ru', 1, 0);
			
			const progress = get(lessonProgress);
			expect(progress.ru).toContain(1);
		});

		it('should not duplicate completed lessons', () => {
			completeLesson('ru', 1, 0);
			completeLesson('ru', 1, 0);
			
			const progress = get(lessonProgress);
			expect(progress.ru.length).toBe(1);
		});

		it('should award XP when specified', () => {
			const initialXP = get(totalXP);
			completeLesson('ru', 1, 50);
			
			const currentXP = get(totalXP);
			expect(currentXP).toBe(initialXP + 50);
		});

		it('should handle multiple languages', () => {
			completeLesson('ru', 1, 0);
			completeLesson('es', 1, 0);
			
			const progress = get(lessonProgress);
			expect(progress.ru).toContain(1);
			expect(progress.es).toContain(1);
		});

		it('should update streak on first completion', () => {
			completeLesson('ru', 1, 0);
			
			const currentStreak = get(streak);
			expect(currentStreak).toBe(1);
		});
	});

	describe('getCompletedCount', () => {
		it('should return 0 for language with no progress', () => {
			const count = getCompletedCount('ru');
			expect(count).toBe(0);
		});

		it('should return correct count', () => {
			completeLesson('ru', 1, 0);
			completeLesson('ru', 2, 0);
			completeLesson('ru', 3, 0);
			
			const count = getCompletedCount('ru');
			expect(count).toBe(3);
		});
	});

	describe('isLessonCompleted', () => {
		it('should return false for uncompleted lesson', () => {
			expect(isLessonCompleted('ru', 1)).toBe(false);
		});

		it('should return true for completed lesson', () => {
			completeLesson('ru', 1, 0);
			expect(isLessonCompleted('ru', 1)).toBe(true);
		});
	});

	describe('resetProgress', () => {
		it('should clear all progress', () => {
			completeLesson('ru', 1, 50);
			resetProgress();
			
			expect(get(lessonProgress)).toEqual({});
			expect(get(totalXP)).toBe(0);
			expect(get(streak)).toBe(0);
			expect(get(lastActiveDate)).toBe(null);
		});
	});

	describe('localStorage persistence', () => {
		it('should persist lesson progress', () => {
			completeLesson('ru', 1, 0);
			
			const stored = localStorage.getItem('lessonProgress');
			expect(stored).toBeTruthy();
			expect(JSON.parse(stored).ru).toContain(1);
		});

		it('should persist total XP', () => {
			completeLesson('ru', 1, 50);
			
			const stored = localStorage.getItem('totalXP');
			expect(stored).toBe('50');
		});
	});

	describe('updateStreak', () => {
		it('should increment streak if practiced yesterday', () => {
			const yesterday = new Date();
			yesterday.setDate(yesterday.getDate() - 1);
			lastActiveDate.set(yesterday.toISOString().split('T')[0]);
			streak.set(5);

			completeLesson('ru', 1, 0);

			expect(get(streak)).toBe(6);
		});

		it('should reset streak if missed a day', () => {
			const threeDaysAgo = new Date();
			threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
			lastActiveDate.set(threeDaysAgo.toISOString().split('T')[0]);
			streak.set(10);

			completeLesson('ru', 1, 0);

			expect(get(streak)).toBe(1);
		});

		it('should not change streak if already active today', () => {
			const today = new Date().toISOString().split('T')[0];
			lastActiveDate.set(today);
			streak.set(7);

			completeLesson('ru', 2, 0);

			expect(get(streak)).toBe(7);
		});
	});
});
