import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	vocabulary,
	trackWord,
	recordPractice,
	getWordProficiency,
	isWordMastered,
	learnedWords,
	masteredWords,
	wordsInProgress,
	vocabularyStats,
	initVocabularyStore
} from './vocabularyStore.js';

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

describe('vocabularyStore', () => {
	beforeEach(() => {
		localStorage.clear();
		vocabulary.set({});
	});

	describe('trackWord', () => {
		it('should add a new word to vocabulary', () => {
			trackWord({
				word: 'книга',
				translation: 'book',
				type: 'noun',
				metadata: {
					gender: 'feminine',
					animacy: 'inanimate',
					difficulty: 'common'
				}
			});

			const vocab = get(vocabulary);
			expect(vocab['книга']).toBeDefined();
			expect(vocab['книга'].word).toBe('книга');
			expect(vocab['книга'].translation).toBe('book');
			expect(vocab['книга'].metadata.gender).toBe('feminine');
			expect(vocab['книга'].timesEncountered).toBe(1);
		});

		it('should increment timesEncountered for existing word', () => {
			trackWord({
				word: 'книга',
				translation: 'book'
			});

			trackWord({
				word: 'книга',
				translation: 'book'
			});

			const vocab = get(vocabulary);
			expect(vocab['книга'].timesEncountered).toBe(2);
		});

		it('should update metadata when tracking existing word', () => {
			trackWord({
				word: 'книга',
				translation: 'book',
				metadata: { gender: 'feminine' }
			});

			trackWord({
				word: 'книга',
				translation: 'book',
				metadata: { difficulty: 'common' }
			});

			const vocab = get(vocabulary);
			expect(vocab['книга'].metadata.gender).toBe('feminine');
			expect(vocab['книга'].metadata.difficulty).toBe('common');
		});
	});

	describe('recordPractice', () => {
		beforeEach(() => {
			trackWord({
				word: 'книга',
				translation: 'book'
			});
		});

		it('should record a correct practice attempt', () => {
			recordPractice('книга', true);

			const vocab = get(vocabulary);
			expect(vocab['книга'].proficiency.correct).toBe(1);
			expect(vocab['книга'].proficiency.total).toBe(1);
			expect(vocab['книга'].proficiency.percentage).toBe(100);
		});

		it('should record an incorrect practice attempt', () => {
			recordPractice('книга', false);

			const vocab = get(vocabulary);
			expect(vocab['книга'].proficiency.correct).toBe(0);
			expect(vocab['книга'].proficiency.total).toBe(1);
			expect(vocab['книга'].proficiency.percentage).toBe(0);
		});

		it('should track form-specific proficiency', () => {
			recordPractice('книга', true, 'genitive');
			recordPractice('книга', false, 'dative');

			const vocab = get(vocabulary);
			expect(vocab['книга'].forms.genitive).toBeDefined();
			expect(vocab['книга'].forms.genitive.correct).toBe(1);
			expect(vocab['книга'].forms.genitive.total).toBe(1);
			expect(vocab['книга'].forms.genitive.percentage).toBe(100);

			expect(vocab['книга'].forms.dative.correct).toBe(0);
			expect(vocab['книга'].forms.dative.total).toBe(1);
			expect(vocab['книга'].forms.dative.percentage).toBe(0);
		});

		it('should calculate percentage correctly over multiple attempts', () => {
			recordPractice('книга', true);
			recordPractice('книга', true);
			recordPractice('книга', false);

			const vocab = get(vocabulary);
			expect(vocab['книга'].proficiency.correct).toBe(2);
			expect(vocab['книга'].proficiency.total).toBe(3);
			expect(vocab['книга'].proficiency.percentage).toBe(67); // rounded
		});
	});

	describe('getWordProficiency', () => {
		it('should return 0 for unknown word', () => {
			expect(getWordProficiency('unknown')).toBe(0);
		});

		it('should return correct proficiency percentage', () => {
			trackWord({ word: 'книга', translation: 'book' });
			recordPractice('книга', true);
			recordPractice('книга', false);

			expect(getWordProficiency('книга')).toBe(50);
		});
	});

	describe('isWordMastered', () => {
		beforeEach(() => {
			trackWord({ word: 'книга', translation: 'book' });
		});

		it('should return false for word with less than 10 correct', () => {
			for (let i = 0; i < 5; i++) {
				recordPractice('книга', true);
			}

			expect(isWordMastered('книга')).toBe(false);
		});

		it('should return false for word with 10+ correct but not 100%', () => {
			for (let i = 0; i < 10; i++) {
				recordPractice('книга', true);
			}
			recordPractice('книга', false);

			expect(isWordMastered('книга')).toBe(false);
		});

		it('should return true for word with 10+ correct and 100%', () => {
			for (let i = 0; i < 10; i++) {
				recordPractice('книга', true);
			}

			expect(isWordMastered('книга')).toBe(true);
		});
	});

	describe('derived stores', () => {
		beforeEach(() => {
			trackWord({ word: 'книга', translation: 'book' });
			trackWord({ word: 'стол', translation: 'table' });
			trackWord({ word: 'дом', translation: 'house' });

			// книга - mastered
			for (let i = 0; i < 10; i++) {
				recordPractice('книга', true);
			}

			// стол - in progress
			recordPractice('стол', true);
			recordPractice('стол', false);

			// дом - not practiced
		});

		it('learnedWords should sort by proficiency', () => {
			const words = get(learnedWords);
			expect(words.length).toBe(3);
			expect(words[0].word).toBe('книга'); // 100%
			expect(words[1].word).toBe('стол'); // 50%
			expect(words[2].word).toBe('дом'); // 0%
		});

		it('masteredWords should only include mastered words', () => {
			const words = get(masteredWords);
			expect(words.length).toBe(1);
			expect(words[0].word).toBe('книга');
		});

		it('wordsInProgress should exclude new and mastered words', () => {
			const words = get(wordsInProgress);
			expect(words.length).toBe(1);
			expect(words[0].word).toBe('стол');
		});

		it('vocabularyStats should calculate correctly', () => {
			const stats = get(vocabularyStats);
			expect(stats.total).toBe(3);
			expect(stats.mastered).toBe(1);
			expect(stats.inProgress).toBe(1);
			expect(stats.new).toBe(1);
			// avg: (100 + 50 + 0) / 3 = 50
			expect(stats.avgProficiency).toBe(50);
		});
	});

	describe('localStorage persistence', () => {
		it('should save vocabulary to localStorage', () => {
			trackWord({ word: 'книга', translation: 'book' });

			const stored = localStorage.getItem('vocabulary');
			expect(stored).toBeDefined();

			const parsed = JSON.parse(stored);
			expect(parsed['книга']).toBeDefined();
		});

		it('should load vocabulary from localStorage on init', () => {
			const testData = {
				книга: {
					word: 'книга',
					translation: 'book',
					type: 'noun',
					metadata: {},
					firstSeen: new Date().toISOString(),
					lastPracticed: new Date().toISOString(),
					timesEncountered: 1,
					proficiency: { correct: 0, total: 0, percentage: 0 },
					forms: {}
				}
			};

			localStorage.setItem('vocabulary', JSON.stringify(testData));
			initVocabularyStore();

			const vocab = get(vocabulary);
			expect(vocab['книга']).toBeDefined();
			expect(vocab['книга'].translation).toBe('book');
		});
	});
});
