/**
 * Quiz state management store
 * Manages current quiz session, score, and progress tracking
 */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Quiz session state
 */
const initialState = {
	currentQuiz: null,
	currentQuestionIndex: 0,
	totalQuestions: 10,
	score: 0,
	answers: [],
	usedWords: [],
	isActive: false,
	settings: {
		quizType: 'all',
		difficulty: 'medium',
		questionCount: 10
	}
};

/**
 * Main quiz store
 */
export const quizState = writable(initialState);

/**
 * Quiz history (persisted to localStorage)
 */
function createQuizHistory() {
	const stored = browser ? localStorage.getItem('quizHistory') : null;
	const initial = stored ? JSON.parse(stored) : [];
	
	const { subscribe, set, update } = writable(initial);

	return {
		subscribe,
		addResult: (result) => update(history => {
			const newHistory = [...history, result];
			if (browser) {
				localStorage.setItem('quizHistory', JSON.stringify(newHistory));
			}
			return newHistory;
		}),
		clear: () => {
			set([]);
			if (browser) {
				localStorage.removeItem('quizHistory');
			}
		}
	};
}

export const quizHistory = createQuizHistory();

/**
 * Derived store for quiz progress
 */
export const quizProgress = derived(quizState, $state => {
	if (!$state.isActive) return 0;
	return Math.round(($state.currentQuestionIndex / $state.totalQuestions) * 100);
});

/**
 * Derived store for quiz accuracy
 */
export const quizAccuracy = derived(quizState, $state => {
	if ($state.answers.length === 0) return 0;
	const correct = $state.answers.filter(a => a.correct).length;
	return Math.round((correct / $state.answers.length) * 100);
});

/**
 * Start a new quiz session
 * @param {Object} settings - Quiz settings (type, difficulty, count)
 */
export function startQuiz(settings = {}) {
	quizState.update(state => ({
		...initialState,
		isActive: true,
		settings: {
			quizType: settings.quizType || 'all',
			difficulty: settings.difficulty || 'medium',
			questionCount: settings.questionCount || 10
		},
		totalQuestions: settings.questionCount || 10
	}));
}

/**
 * Set the current quiz question
 * @param {Object} quiz - Quiz question data
 */
export function setCurrentQuiz(quiz) {
	quizState.update(state => ({
		...state,
		currentQuiz: quiz,
		usedWords: [...state.usedWords, quiz.word]
	}));
}

/**
 * Submit an answer for the current quiz
 * @param {boolean} correct - Whether the answer was correct
 * @param {string} userAnswer - The user's answer
 */
export function submitAnswer(correct, userAnswer = '') {
	quizState.update(state => {
		const answer = {
			question: state.currentQuiz,
			userAnswer: userAnswer,
			correct: correct,
			timestamp: new Date().toISOString()
		};

		return {
			...state,
			score: correct ? state.score + 1 : state.score,
			answers: [...state.answers, answer]
		};
	});
}

/**
 * Move to the next question
 */
export function nextQuestion() {
	quizState.update(state => ({
		...state,
		currentQuestionIndex: state.currentQuestionIndex + 1,
		currentQuiz: null
	}));
}

/**
 * End the current quiz session
 */
export function endQuiz() {
	const state = get(quizState);
	
	// Save to history
	const result = {
		date: new Date().toISOString(),
		score: state.score,
		totalQuestions: state.answers.length,
		accuracy: state.answers.length > 0 
			? Math.round((state.score / state.answers.length) * 100) 
			: 0,
		difficulty: state.settings.difficulty,
		quizType: state.settings.quizType,
		answers: state.answers
	};
	
	quizHistory.addResult(result);

	// Reset state
	quizState.set(initialState);

	return result;
}

/**
 * Get stats by case (which cases the user struggles with)
 * @param {Array} history - Quiz history
 * @returns {Object} Stats by case
 */
export function getStatsByCase(history = null) {
	const historyData = history || get(quizHistory);
	const stats = {
		nominative: { correct: 0, total: 0 },
		genitive: { correct: 0, total: 0 },
		dative: { correct: 0, total: 0 },
		accusative: { correct: 0, total: 0 },
		instrumental: { correct: 0, total: 0 },
		prepositional: { correct: 0, total: 0 }
	};

	historyData.forEach(session => {
		session.answers.forEach(answer => {
			const question = answer.question;
			const targetCase = question.targetCase || question.requiredCase;
			
			if (targetCase && stats[targetCase]) {
				stats[targetCase].total++;
				if (answer.correct) {
					stats[targetCase].correct++;
				}
			}
		});
	});

	// Calculate percentages
	Object.keys(stats).forEach(caseName => {
		const stat = stats[caseName];
		stat.accuracy = stat.total > 0 
			? Math.round((stat.correct / stat.total) * 100) 
			: 0;
	});

	return stats;
}

/**
 * Get overall stats
 * @param {Array} history - Quiz history
 * @returns {Object} Overall stats
 */
export function getOverallStats(history = null) {
	const historyData = history || get(quizHistory);
	
	if (historyData.length === 0) {
		return {
			totalQuizzes: 0,
			totalQuestions: 0,
			totalCorrect: 0,
			overallAccuracy: 0,
			averageScore: 0
		};
	}

	const totalQuizzes = historyData.length;
	let totalQuestions = 0;
	let totalCorrect = 0;

	historyData.forEach(session => {
		totalQuestions += session.totalQuestions;
		totalCorrect += session.score;
	});

	return {
		totalQuizzes,
		totalQuestions,
		totalCorrect,
		overallAccuracy: totalQuestions > 0 
			? Math.round((totalCorrect / totalQuestions) * 100) 
			: 0,
		averageScore: totalQuizzes > 0 
			? Math.round(totalCorrect / totalQuizzes) 
			: 0
	};
}

/**
 * Reset all quiz data (for testing)
 */
export function resetQuizData() {
	quizState.set(initialState);
	quizHistory.clear();
}
