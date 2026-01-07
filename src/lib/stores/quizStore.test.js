import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	quizState,
	quizHistory,
	quizProgress,
	quizAccuracy,
	startQuiz,
	setCurrentQuiz,
	submitAnswer,
	nextQuestion,
	endQuiz,
	getStatsByCase,
	getOverallStats,
	resetQuizData
} from './quizStore.js';

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
	}
});

describe('quizStore', () => {
	beforeEach(() => {
		localStorage.data = {};
		resetQuizData();
	});

	describe('startQuiz', () => {
		it('should initialize quiz state', () => {
			startQuiz({ quizType: 'all', difficulty: 'medium', questionCount: 10 });
			
			const state = get(quizState);
			expect(state.isActive).toBe(true);
			expect(state.totalQuestions).toBe(10);
			expect(state.settings.quizType).toBe('all');
		});

		it('should use default settings if none provided', () => {
			startQuiz();
			
			const state = get(quizState);
			expect(state.settings.quizType).toBe('all');
			expect(state.settings.difficulty).toBe('medium');
		});
	});

	describe('setCurrentQuiz', () => {
		it('should set the current quiz question', () => {
			const quiz = { word: 'дом', translation: 'house' };
			setCurrentQuiz(quiz);
			
			const state = get(quizState);
			expect(state.currentQuiz).toEqual(quiz);
		});

		it('should add word to used words', () => {
			const quiz = { word: 'дом', translation: 'house' };
			setCurrentQuiz(quiz);
			
			const state = get(quizState);
			expect(state.usedWords).toContain('дом');
		});
	});

	describe('submitAnswer', () => {
		it('should record a correct answer', () => {
			startQuiz();
			const quiz = { word: 'дом', translation: 'house' };
			setCurrentQuiz(quiz);
			submitAnswer(true, 'дома');
			
			const state = get(quizState);
			expect(state.score).toBe(1);
			expect(state.answers.length).toBe(1);
			expect(state.answers[0].correct).toBe(true);
		});

		it('should record an incorrect answer', () => {
			startQuiz();
			const quiz = { word: 'дом', translation: 'house' };
			setCurrentQuiz(quiz);
			submitAnswer(false, 'wrong');
			
			const state = get(quizState);
			expect(state.score).toBe(0);
			expect(state.answers.length).toBe(1);
			expect(state.answers[0].correct).toBe(false);
		});
	});

	describe('nextQuestion', () => {
		it('should increment question index', () => {
			startQuiz();
			nextQuestion();
			
			const state = get(quizState);
			expect(state.currentQuestionIndex).toBe(1);
		});

		it('should clear current quiz', () => {
			startQuiz();
			setCurrentQuiz({ word: 'дом' });
			nextQuestion();
			
			const state = get(quizState);
			expect(state.currentQuiz).toBe(null);
		});
	});

	describe('quizProgress', () => {
		it('should calculate progress percentage', () => {
			startQuiz({ questionCount: 10 });
			
			// Answer 3 questions
			for (let i = 0; i < 3; i++) {
				setCurrentQuiz({ word: `word${i}` });
				submitAnswer(true);
				nextQuestion();
			}
			
			const progress = get(quizProgress);
			expect(progress).toBe(30); // 3/10 * 100
		});

		it('should return 0 when quiz is not active', () => {
			const progress = get(quizProgress);
			expect(progress).toBe(0);
		});
	});

	describe('quizAccuracy', () => {
		it('should calculate accuracy percentage', () => {
			startQuiz();
			setCurrentQuiz({ word: 'test1' });
			submitAnswer(true);
			setCurrentQuiz({ word: 'test2' });
			submitAnswer(true);
			setCurrentQuiz({ word: 'test3' });
			submitAnswer(false);
			
			const accuracy = get(quizAccuracy);
			expect(accuracy).toBe(67); // 2/3 * 100, rounded
		});

		it('should return 0 when no answers', () => {
			startQuiz();
			const accuracy = get(quizAccuracy);
			expect(accuracy).toBe(0);
		});
	});

	describe('endQuiz', () => {
		it('should save quiz result to history', () => {
			startQuiz({ questionCount: 5 });
			
			for (let i = 0; i < 5; i++) {
				setCurrentQuiz({ word: `word${i}` });
				submitAnswer(i < 3); // 3 correct, 2 incorrect
				nextQuestion();
			}
			
			endQuiz();
			
			const history = get(quizHistory);
			expect(history.length).toBe(1);
			expect(history[0].score).toBe(3);
			expect(history[0].totalQuestions).toBe(5);
		});

		it('should reset quiz state', () => {
			startQuiz();
			endQuiz();
			
			const state = get(quizState);
			expect(state.isActive).toBe(false);
			expect(state.score).toBe(0);
		});
	});

	describe('getOverallStats', () => {
		it('should return zero stats for empty history', () => {
			const stats = getOverallStats([]);
			
			expect(stats.totalQuizzes).toBe(0);
			expect(stats.totalQuestions).toBe(0);
			expect(stats.overallAccuracy).toBe(0);
		});

		it('should calculate overall stats', () => {
			const history = [
				{ score: 8, totalQuestions: 10 },
				{ score: 6, totalQuestions: 10 }
			];
			
			const stats = getOverallStats(history);
			
			expect(stats.totalQuizzes).toBe(2);
			expect(stats.totalQuestions).toBe(20);
			expect(stats.totalCorrect).toBe(14);
			expect(stats.overallAccuracy).toBe(70);
		});
	});
});
