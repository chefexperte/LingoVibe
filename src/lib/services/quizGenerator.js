/**
 * Quiz generator for Russian grammar quizzes
 * Generates different types of quizzes using Wiktionary data
 */

import { fetchFullDeclension } from '../wiktionary.js';
import { russianNouns, getRandomNoun, getNounsByDifficulty } from '../data/russianNouns.js';
import { sentenceTemplates, getRandomTemplate, getTemplatesByDifficulty, russianCases } from '../data/sentenceTemplates.js';
import { areWordsEquivalent } from './wiktionaryParser.js';

/**
 * Fisher-Yates shuffle algorithm for proper randomization
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

/**
 * Quiz types
 */
export const QUIZ_TYPES = {
	CASE_FORMATION: 'case-formation',
	CASE_FORMATION_MC: 'case-formation-mc',
	CASE_IDENTIFICATION: 'case-identification',
	SENTENCE_COMPLETION: 'sentence-completion',
	SENTENCE_COMPLETION_MC: 'sentence-completion-mc',
	ALL: 'all'
};

/**
 * Difficulty levels
 */
export const DIFFICULTY_LEVELS = {
	EASY: 'easy',
	MEDIUM: 'medium',
	HARD: 'hard'
};

/**
 * Generate a quiz question
 * @param {string} type - Quiz type
 * @param {string} difficulty - Difficulty level
 * @param {Array} excludeWords - Words to exclude (to avoid repetition)
 * @param {Array} selectedCases - Optional array of cases to include in quiz
 * @returns {Promise<Object>} Quiz question object
 */
export async function generateQuiz(type, difficulty = DIFFICULTY_LEVELS.MEDIUM, excludeWords = [], selectedCases = null) {
	// Select random quiz type if 'all' is specified
	if (type === QUIZ_TYPES.ALL) {
		const types = [
			QUIZ_TYPES.CASE_FORMATION,
			QUIZ_TYPES.CASE_FORMATION_MC,
			QUIZ_TYPES.CASE_IDENTIFICATION,
			QUIZ_TYPES.SENTENCE_COMPLETION,
			QUIZ_TYPES.SENTENCE_COMPLETION_MC
		];
		type = types[Math.floor(Math.random() * types.length)];
	}

	switch (type) {
		case QUIZ_TYPES.CASE_FORMATION:
			return generateCaseFormationQuiz(difficulty, excludeWords, selectedCases);
		case QUIZ_TYPES.CASE_FORMATION_MC:
			return generateCaseFormationMCQuiz(difficulty, excludeWords, selectedCases);
		case QUIZ_TYPES.CASE_IDENTIFICATION:
			return generateCaseIdentificationQuiz(difficulty, excludeWords, selectedCases);
		case QUIZ_TYPES.SENTENCE_COMPLETION:
			return generateSentenceCompletionQuiz(difficulty, excludeWords, selectedCases);
		case QUIZ_TYPES.SENTENCE_COMPLETION_MC:
			return generateSentenceCompletionMCQuiz(difficulty, excludeWords, selectedCases);
		default:
			return generateCaseFormationQuiz(difficulty, excludeWords, selectedCases);
	}
}

/**
 * Generate a case formation quiz (fill-in-the-blank)
 * @param {string} difficulty - Difficulty level
 * @param {Array} excludeWords - Words to exclude
 * @param {Array} selectedCases - Optional array of cases to include
 * @returns {Promise<Object>} Quiz question
 */
async function generateCaseFormationQuiz(difficulty, excludeWords = [], selectedCases = null) {
	const wordDifficulty = mapDifficultyToWordLevel(difficulty);
	const targetCase = selectRandomCase(difficulty, selectedCases);
	const nounData = selectRandomNounData(wordDifficulty, excludeWords);
	
	try {
		const declension = await fetchFullDeclension(nounData.word, {
			gender: nounData.gender,
			animacy: nounData.animacy,
			translation: nounData.translation
		});

		const correctAnswer = declension.declension.singular[targetCase];

		return {
			type: QUIZ_TYPES.CASE_FORMATION,
			quizType: 'fill-in',
			question: `What is the ${targetCase} form of the word?`,
			word: nounData.word,
			wordTranslation: nounData.translation,
			targetCase: targetCase,
			correctAnswer: correctAnswer,
			correctAnswers: [correctAnswer], // For validation
			declension: declension,
			fromWiktionary: true,
			difficulty: difficulty,
			frequency: nounData.frequency || 5
		};
	} catch (error) {
		console.error('Error generating case formation quiz:', error);
		// Return a fallback quiz using the noun data without full declension
		throw new Error('Failed to generate quiz question. Please try again.');
	}
}

/**
 * Generate a multiple choice case formation quiz
 * @param {string} difficulty - Difficulty level
 * @param {Array} excludeWords - Words to exclude
 * @param {Array} selectedCases - Optional array of cases to include
 * @returns {Promise<Object>} Quiz question
 */
async function generateCaseFormationMCQuiz(difficulty, excludeWords = [], selectedCases = null) {
	const wordDifficulty = mapDifficultyToWordLevel(difficulty);
	const targetCase = selectRandomCase(difficulty, selectedCases);
	const nounData = selectRandomNounData(wordDifficulty, excludeWords);
	
	try {
		const declension = await fetchFullDeclension(nounData.word, {
			gender: nounData.gender,
			animacy: nounData.animacy,
			translation: nounData.translation
		});

		const correctAnswer = declension.declension.singular[targetCase];
		
		// Generate wrong answers from other cases of the same word
		const wrongAnswers = [];
		const allCases = ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional'];
		for (const c of allCases) {
			if (c !== targetCase) {
				const form = declension.declension.singular[c];
				if (form !== correctAnswer && !wrongAnswers.includes(form)) {
					wrongAnswers.push(form);
				}
			}
		}

		// Shuffle and take 3 wrong answers
		const shuffledWrong = shuffleArray(wrongAnswers).slice(0, 3);
		
		// Create options
		const options = [
			{ text: correctAnswer, correct: true },
			...shuffledWrong.map(ans => ({ text: ans, correct: false }))
		];

		// Shuffle options
		const shuffledOptions = shuffleArray(options);

		return {
			type: QUIZ_TYPES.CASE_FORMATION_MC,
			quizType: 'multiple-choice',
			question: `What is the ${targetCase} form of "${nounData.word}"?`,
			word: nounData.word,
			wordTranslation: nounData.translation,
			targetCase: targetCase,
			options: shuffledOptions,
			correctAnswer: correctAnswer,
			declension: declension,
			fromWiktionary: true,
			difficulty: difficulty,
			frequency: nounData.frequency || 5
		};
	} catch (error) {
		console.error('Error generating case formation MC quiz:', error);
		throw new Error('Failed to generate quiz question. Please try again.');
	}
}

/**
 * Generate a case identification quiz
 * @param {string} difficulty - Difficulty level
 * @param {Array} excludeWords - Words to exclude
 * @param {Array} selectedCases - Optional array of cases to include
 * @returns {Promise<Object>} Quiz question
 */
async function generateCaseIdentificationQuiz(difficulty, excludeWords = [], selectedCases = null) {
	const wordDifficulty = mapDifficultyToWordLevel(difficulty);
	const nounData = selectRandomNounData(wordDifficulty, excludeWords);
	
	try {
		const declension = await fetchFullDeclension(nounData.word, {
			gender: nounData.gender,
			animacy: nounData.animacy,
			translation: nounData.translation
		});

		// Select a random case (not nominative for more challenge)
		const availableCases = ['genitive', 'dative', 'accusative', 'instrumental', 'prepositional'];
		const targetCase = availableCases[Math.floor(Math.random() * availableCases.length)];
		
		const declinedWord = declension.declension.singular[targetCase];

		// Find all cases that have the same form (there might be multiple correct answers)
		const correctCases = [];
		for (const [caseName, form] of Object.entries(declension.declension.singular)) {
			if (areWordsEquivalent(form, declinedWord, true)) {
				correctCases.push(caseName);
			}
		}

		// Create options for all 6 cases
		const options = russianCases.map(caseName => ({
			text: capitalize(caseName),
			value: caseName,
			correct: correctCases.includes(caseName)
		}));

		return {
			type: QUIZ_TYPES.CASE_IDENTIFICATION,
			quizType: 'multiple-choice',
			question: `The word "${declinedWord}" is in which case? (Multiple answers may be correct)`,
			word: nounData.word,
			wordTranslation: nounData.translation,
			declinedWord: declinedWord,
			options: options,
			correctCases: correctCases,
			declension: declension,
			fromWiktionary: true,
			difficulty: difficulty,
			frequency: nounData.frequency || 5,
			multipleCorrect: correctCases.length > 1
		};
	} catch (error) {
		console.error('Error generating case identification quiz:', error);
		throw new Error('Failed to generate quiz question. Please try again.');
	}
}

/**
 * Generate a sentence completion quiz
 * @param {string} difficulty - Difficulty level
 * @param {Array} excludeWords - Words to exclude
 * @param {Array} selectedCases - Optional array of cases to include
 * @returns {Promise<Object>} Quiz question
 */
async function generateSentenceCompletionQuiz(difficulty, excludeWords = [], selectedCases = null) {
	const wordDifficulty = mapDifficultyToWordLevel(difficulty);
	const template = getRandomTemplate(wordDifficulty);
	const nounData = selectRandomNounData(wordDifficulty, excludeWords);
	
	try {
		const declension = await fetchFullDeclension(nounData.word, {
			gender: nounData.gender,
			animacy: nounData.animacy,
			translation: nounData.translation
		});

		const correctAnswer = declension.declension.singular[template.requiredCase];

		return {
			type: QUIZ_TYPES.SENTENCE_COMPLETION,
			quizType: 'fill-in',
			question: 'Complete the sentence:',
			sentenceRussian: template.russian,
			sentenceEnglish: template.english,
			word: nounData.word,
			wordTranslation: nounData.translation,
			requiredCase: template.requiredCase,
			correctAnswer: correctAnswer,
			correctAnswers: [correctAnswer],
			declension: declension,
			explanation: template.explanation,
			fromWiktionary: true,
			difficulty: difficulty,
			frequency: nounData.frequency || 5
		};
	} catch (error) {
		console.error('Error generating sentence completion quiz:', error);
		throw new Error('Failed to generate quiz question. Please try again.');
	}
}

/**
 * Generate a sentence completion multiple choice quiz
 * @param {string} difficulty - Difficulty level
 * @param {Array} excludeWords - Words to exclude
 * @param {Array} selectedCases - Optional array of cases to include
 * @returns {Promise<Object>} Quiz question
 */
async function generateSentenceCompletionMCQuiz(difficulty, excludeWords = [], selectedCases = null) {
	const wordDifficulty = mapDifficultyToWordLevel(difficulty);
	const template = getRandomTemplate(wordDifficulty);
	const nounData = selectRandomNounData(wordDifficulty, excludeWords);
	
	try {
		const declension = await fetchFullDeclension(nounData.word, {
			gender: nounData.gender,
			animacy: nounData.animacy,
			translation: nounData.translation
		});

		const correctAnswer = declension.declension.singular[template.requiredCase];
		
		// Generate wrong answers from other cases
		const allCases = ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional'];
		const wrongCases = allCases.filter(c => c !== template.requiredCase);
		const wrongAnswers = shuffleArray(wrongCases)
			.map(c => declension.declension.singular[c])
			.filter(ans => ans !== correctAnswer)
			.slice(0, 3);

		// Create options array with correct and wrong answers
		const options = [
			{ text: correctAnswer, correct: true },
			...wrongAnswers.map(ans => ({ text: ans, correct: false }))
		];

		// Shuffle options
		const shuffledOptions = shuffleArray(options);

		return {
			type: QUIZ_TYPES.SENTENCE_COMPLETION_MC,
			quizType: 'multiple-choice',
			question: 'Complete the sentence:',
			sentenceRussian: template.russian,
			sentenceEnglish: template.english,
			word: nounData.word,
			wordTranslation: nounData.translation,
			requiredCase: template.requiredCase,
			correctAnswer: correctAnswer,
			options: shuffledOptions,
			declension: declension,
			explanation: template.explanation,
			fromWiktionary: true,
			difficulty: difficulty,
			frequency: nounData.frequency || 5
		};
	} catch (error) {
		console.error('Error generating sentence completion MC quiz:', error);
		throw new Error('Failed to generate quiz question. Please try again.');
	}
}

/**
 * Select a random noun that's not in the exclude list
 * @param {string} difficulty - Word difficulty level
 * @param {Array} excludeWords - Words to exclude
 * @returns {Object} Noun data object
 */
function selectRandomNounData(difficulty, excludeWords = []) {
	const availableNouns = getNounsByDifficulty(difficulty).filter(
		noun => !excludeWords.includes(noun.word)
	);
	
	if (availableNouns.length === 0) {
		// If all words are excluded, return a random word anyway
		return getRandomNoun(difficulty);
	}
	
	return availableNouns[Math.floor(Math.random() * availableNouns.length)];
}

/**
 * Select a random case based on difficulty
 * @param {string} difficulty - Difficulty level
 * @param {Array} selectedCases - Optional array of cases to select from
 * @returns {string} Case name
 */
function selectRandomCase(difficulty, selectedCases = null) {
	let availableCases;
	
	// If selectedCases is provided, use only those cases
	if (selectedCases && selectedCases.length > 0) {
		availableCases = selectedCases;
	} else if (difficulty === DIFFICULTY_LEVELS.EASY) {
		// Easy: Only nominative, accusative, genitive, prepositional
		availableCases = ['nominative', 'accusative', 'genitive', 'prepositional'];
	} else if (difficulty === DIFFICULTY_LEVELS.MEDIUM) {
		// Medium: All cases except nominative
		availableCases = ['genitive', 'dative', 'accusative', 'instrumental', 'prepositional'];
	} else {
		// Hard: All cases
		availableCases = russianCases;
	}
	
	return availableCases[Math.floor(Math.random() * availableCases.length)];
}

/**
 * Map quiz difficulty to word difficulty level
 * @param {string} difficulty - Quiz difficulty
 * @returns {string} Word difficulty
 */
function mapDifficultyToWordLevel(difficulty) {
	const mapping = {
		[DIFFICULTY_LEVELS.EASY]: 'common',
		[DIFFICULTY_LEVELS.MEDIUM]: 'intermediate',
		[DIFFICULTY_LEVELS.HARD]: 'advanced'
	};
	return mapping[difficulty] || 'intermediate';
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Validate user answer for a quiz
 * @param {Object} quiz - The quiz question
 * @param {string} userAnswer - User's answer
 * @returns {boolean} True if correct
 */
export function validateAnswer(quiz, userAnswer) {
	if (quiz.quizType === 'fill-in') {
		// Check if answer matches any of the correct answers
		return quiz.correctAnswers.some(correct => 
			areWordsEquivalent(userAnswer, correct, true)
		);
	} else if (quiz.quizType === 'multiple-choice') {
		// For multiple choice, check if the selected option is correct
		return userAnswer === quiz.correctAnswer;
	}
	return false;
}

/**
 * Validate multiple-select answer (for case identification)
 * @param {Object} quiz - The quiz question
 * @param {Array} selectedCases - Array of selected case names
 * @returns {Object} Validation result with score
 */
export function validateMultipleAnswer(quiz, selectedCases) {
	if (quiz.type !== QUIZ_TYPES.CASE_IDENTIFICATION) {
		return { correct: false, score: 0 };
	}

	const correctCases = new Set(quiz.correctCases);
	const selected = new Set(selectedCases);

	// Check if all correct cases are selected and no incorrect ones
	const allCorrect = [...correctCases].every(c => selected.has(c));
	const noIncorrect = [...selected].every(c => correctCases.has(c));

	return {
		correct: allCorrect && noIncorrect,
		score: allCorrect && noIncorrect ? 1 : 0,
		partial: !allCorrect && selected.size > 0,
		correctCases: [...correctCases],
		selectedCases: [...selected]
	};
}
