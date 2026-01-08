/**
 * Vocabulary Store
 * Tracks learned words, proficiency, and practice history
 */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { STORAGE_KEYS } from '$lib/utils/constants.js';

/**
 * Vocabulary data structure:
 * {
 *   [word]: {
 *     word: string,                    // e.g., "книга"
 *     translation: string,             // e.g., "book"
 *     type: 'noun' | 'verb' | 'adjective',
 *     
 *     // Metadata (noun-specific, expandable for other types)
 *     metadata: {
 *       gender: 'masculine' | 'feminine' | 'neuter',
 *       animacy: 'animate' | 'inanimate',
 *       difficulty: 'common' | 'intermediate' | 'advanced',
 *       frequency: number,              // 1-10 scale
 *     },
 *     
 *     // Tracking info
 *     firstSeen: ISO date string,
 *     lastPracticed: ISO date string,
 *     timesEncountered: number,         // Total times seen in lessons/quizzes
 *     
 *     // Overall proficiency
 *     proficiency: {
 *       correct: number,                // Total correct answers
 *       total: number,                  // Total attempts
 *       percentage: number              // calculated: (correct/total) * 100
 *     },
 *     
 *     // Form-specific proficiency (for nouns: cases, for verbs: tenses, etc.)
 *     forms: {
 *       [form]: {                       // e.g., "nominative", "genitive"
 *         correct: number,
 *         total: number,
 *         percentage: number,
 *         lastPracticed: ISO date string
 *       }
 *     }
 *   }
 * }
 */

const initialVocabulary = {};

export const vocabulary = writable(initialVocabulary);

/**
 * Initialize vocabulary store from localStorage
 */
export function initVocabularyStore() {
	if (!browser) return;

	try {
		const stored = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
		if (stored) {
			const parsed = JSON.parse(stored);
			vocabulary.set(parsed);
		}
	} catch (e) {
		console.error('Error loading vocabulary:', e);
	}
}

/**
 * Save vocabulary to localStorage
 */
function saveVocabulary() {
	if (!browser) return;

	try {
		const data = get(vocabulary);
		localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(data));
	} catch (e) {
		console.error('Error saving vocabulary:', e);
	}
}

/**
 * Add or update a word in vocabulary
 * @param {Object} wordData - Word information
 */
export function trackWord(wordData) {
	const { word, translation, type = 'noun', metadata = {} } = wordData;

	if (!word) return;

	vocabulary.update((vocab) => {
		const existing = vocab[word];
		const now = new Date().toISOString();

		if (existing) {
			// Update existing word
			existing.timesEncountered += 1;
			existing.lastPracticed = now;

			// Update metadata if provided
			if (metadata) {
				existing.metadata = { ...existing.metadata, ...metadata };
			}
		} else {
			// Add new word
			vocab[word] = {
				word,
				translation: translation || '',
				type,
				metadata: {
					gender: metadata.gender || null,
					animacy: metadata.animacy || null,
					difficulty: metadata.difficulty || 'intermediate',
					frequency: metadata.frequency || 5
				},
				firstSeen: now,
				lastPracticed: now,
				timesEncountered: 1,
				proficiency: {
					correct: 0,
					total: 0,
					percentage: 0,
					masteryProgress: 0,  // Count towards mastery (max 10)
					isMastered: false    // Flag for mastered status
				},
				forms: {}
			};
		}

		return vocab;
	});

	saveVocabulary();
}

/**
 * Record a practice attempt for a word
 * @param {string} word - The word
 * @param {boolean} correct - Was the answer correct?
 * @param {string} form - The specific form practiced (e.g., "genitive", "singular")
 */
export function recordPractice(word, correct, form = null) {
	if (!word) return;

	vocabulary.update((vocab) => {
		const wordData = vocab[word];
		if (!wordData) {
			console.warn(`Word "${word}" not found in vocabulary`);
			return vocab;
		}

		const now = new Date().toISOString();

		// Update overall proficiency
		wordData.proficiency.total += 1;
		if (correct) {
			wordData.proficiency.correct += 1;
			
			// Update mastery progress (max 10)
			if (wordData.proficiency.masteryProgress < 10) {
				wordData.proficiency.masteryProgress += 1;
			}
		} else {
			// Wrong answer resets mastery progress
			wordData.proficiency.masteryProgress = 0;
		}
		
		// Check if mastered (10 correct in a row)
		if (wordData.proficiency.masteryProgress >= 10) {
			wordData.proficiency.isMastered = true;
		}
		
		// Calculate percentage (for display after mastery)
		wordData.proficiency.percentage = Math.round(
			(wordData.proficiency.correct / wordData.proficiency.total) * 100
		);

		// Update form-specific proficiency
		if (form) {
			if (!wordData.forms[form]) {
				wordData.forms[form] = {
					correct: 0,
					total: 0,
					percentage: 0,
					masteryProgress: 0,
					isMastered: false,
					lastPracticed: now
				};
			}

			const formData = wordData.forms[form];
			formData.total += 1;
			if (correct) {
				formData.correct += 1;
				if (formData.masteryProgress < 10) {
					formData.masteryProgress += 1;
				}
			} else {
				formData.masteryProgress = 0;
			}
			
			if (formData.masteryProgress >= 10) {
				formData.isMastered = true;
			}
			
			formData.percentage = Math.round((formData.correct / formData.total) * 100);
			formData.lastPracticed = now;
		}

		wordData.lastPracticed = now;

		return vocab;
	});

	saveVocabulary();
}

/**
 * Get proficiency for a specific word
 * @param {string} word - The word
 * @returns {number} Proficiency percentage (0-100)
 */
export function getWordProficiency(word) {
	const vocab = get(vocabulary);
	return vocab[word]?.proficiency.percentage || 0;
}

/**
 * Check if word is "mastered" (10 correct in a row)
 * @param {string} word - The word
 * @returns {boolean}
 */
export function isWordMastered(word) {
	const vocab = get(vocabulary);
	return vocab[word]?.proficiency.isMastered || false;
}

/**
 * Derived store - all learned words sorted by proficiency
 */
export const learnedWords = derived(vocabulary, ($vocab) => {
	return Object.values($vocab).sort((a, b) => {
		// Sort by proficiency descending, then by last practiced
		if (b.proficiency.percentage !== a.proficiency.percentage) {
			return b.proficiency.percentage - a.proficiency.percentage;
		}
		return new Date(b.lastPracticed) - new Date(a.lastPracticed);
	});
});

/**
 * Derived store - mastered words (10 correct in a row)
 */
export const masteredWords = derived(vocabulary, ($vocab) => {
	return Object.values($vocab).filter(
		(word) => word.proficiency.isMastered
	);
});

/**
 * Derived store - words in progress (>0% but not mastered)
 */
export const wordsInProgress = derived(vocabulary, ($vocab) => {
	return Object.values($vocab).filter(
		(word) =>
			word.proficiency.total > 0 &&
			!word.proficiency.isMastered
	);
});

/**
 * Derived store - vocabulary statistics
 */
export const vocabularyStats = derived(vocabulary, ($vocab) => {
	const words = Object.values($vocab);
	const total = words.length;
	const mastered = words.filter(
		(w) => w.proficiency.isMastered
	).length;
	const inProgress = words.filter(
		(w) =>
			w.proficiency.total > 0 &&
			!w.proficiency.isMastered
	).length;
	const new_words = words.filter((w) => w.proficiency.total === 0).length;

	const avgProficiency =
		total > 0
			? Math.round(words.reduce((sum, w) => sum + w.proficiency.percentage, 0) / total)
			: 0;

	return {
		total,
		mastered,
		inProgress,
		new: new_words,
		avgProficiency
	};
});
