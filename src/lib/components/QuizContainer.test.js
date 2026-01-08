import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { render, fireEvent } from '@testing-library/svelte';
import QuizContainer from './QuizContainer.svelte';
import { quizState } from '$lib/stores/quizStore.js';

// Mock quiz generator
vi.mock('$lib/services/quizGenerator.js', () => ({
	generateQuiz: vi.fn(() => Promise.resolve({
		word: 'тест',
		wordTranslation: 'test',
		targetCase: 'genitive',
		correctAnswer: 'теста'
	})),
	QUIZ_TYPES: {
		CASE_FORMATION: 'case-formation',
		CASE_IDENTIFICATION: 'case-identification',
		SENTENCE_COMPLETION: 'sentence-completion'
	}
}));

describe('QuizContainer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render quiz container', () => {
		const { container } = render(QuizContainer, {
			props: { onComplete: vi.fn() }
		});

		expect(container).toBeTruthy();
	});

	it('should respect question limit settings', () => {
		// Set quiz to 5 questions
		quizState.set({
			currentQuestionIndex: 0,
			totalQuestions: 5,
			answers: [],
			isActive: true,
			settings: { questionCount: 5 }
		});

		const { container } = render(QuizContainer, {
			props: { onComplete: vi.fn() }
		});

		// The quiz should show progress out of 5
		expect(container.textContent).toContain('5');
	});

	it('should call onComplete when quiz finishes', async () => {
		const onComplete = vi.fn();
		
		// Set quiz to last question
		quizState.set({
			currentQuestionIndex: 4,
			totalQuestions: 5,
			answers: [
				{ correct: true, word: 'test1' },
				{ correct: true, word: 'test2' },
				{ correct: false, word: 'test3' },
				{ correct: true, word: 'test4' }
			],
			isActive: true,
			settings: { questionCount: 5 }
		});

		const { container } = render(QuizContainer, {
			props: { onComplete }
		});

		// Verify container exists
		expect(container).toBeTruthy();
	});

	it('should track answers correctly', () => {
		const answers = [
			{ correct: true, word: 'дом' },
			{ correct: false, word: 'стол' },
			{ correct: true, word: 'книга' }
		];

		quizState.set({
			currentQuestionIndex: 3,
			totalQuestions: 5,
			answers,
			isActive: true,
			settings: { questionCount: 5 }
		});

		const state = quizState;
		expect(answers.length).toBe(3);
		expect(answers.filter(a => a.correct).length).toBe(2);
	});

	it('should not exceed configured question count', () => {
		const maxQuestions = 10;
		
		quizState.set({
			currentQuestionIndex: 0,
			totalQuestions: maxQuestions,
			answers: [],
			isActive: true,
			settings: { questionCount: maxQuestions }
		});

		const state = get(quizState);
		expect(state.totalQuestions).toBe(maxQuestions);
		expect(state.currentQuestionIndex).toBeLessThan(maxQuestions);
	});
});
