import { describe, it, expect } from 'vitest';
import { 
	irregularNouns, 
	hasIrregularData, 
	getIrregularDeclension,
	getIrregularWords 
} from './irregularNouns.js';
import { isValidDeclension } from '../services/wiktionaryParser.js';

describe('irregularNouns', () => {
	
	describe('irregularNouns data', () => {
		it('should contain время (time)', () => {
			expect(irregularNouns['время']).toBeDefined();
			expect(irregularNouns['время'].word).toBe('время');
			expect(irregularNouns['время'].gender).toBe('neuter');
		});

		it('should contain дочь (daughter)', () => {
			expect(irregularNouns['дочь']).toBeDefined();
			expect(irregularNouns['дочь'].word).toBe('дочь');
			expect(irregularNouns['дочь'].gender).toBe('feminine');
		});

		it('should contain мать (mother)', () => {
			expect(irregularNouns['мать']).toBeDefined();
			expect(irregularNouns['мать'].word).toBe('мать');
			expect(irregularNouns['мать'].gender).toBe('feminine');
		});

		it('should contain путь (path)', () => {
			expect(irregularNouns['путь']).toBeDefined();
			expect(irregularNouns['путь'].word).toBe('путь');
			expect(irregularNouns['путь'].gender).toBe('masculine');
		});

		it('should contain имя (name)', () => {
			expect(irregularNouns['имя']).toBeDefined();
			expect(irregularNouns['имя'].word).toBe('имя');
			expect(irregularNouns['имя'].gender).toBe('neuter');
		});

		it('should contain человек (person)', () => {
			expect(irregularNouns['человек']).toBeDefined();
			expect(irregularNouns['человек'].word).toBe('человек');
			expect(irregularNouns['человек'].declension.plural.nominative).toBe('люди');
		});

		it('should contain ребёнок (child)', () => {
			expect(irregularNouns['ребёнок']).toBeDefined();
			expect(irregularNouns['ребёнок'].word).toBe('ребёнок');
			expect(irregularNouns['ребёнок'].declension.plural.nominative).toBe('дети');
		});
	});

	describe('irregular declension correctness', () => {
		it('should have correct declension for время', () => {
			const vremya = irregularNouns['время'];
			
			expect(vremya.declension.singular.nominative).toBe('время');
			expect(vremya.declension.singular.genitive).toBe('времени');
			expect(vremya.declension.singular.dative).toBe('времени');
			expect(vremya.declension.singular.accusative).toBe('время');
			expect(vremya.declension.singular.instrumental).toBe('временем');
			expect(vremya.declension.singular.prepositional).toBe('времени');
			
			expect(vremya.declension.plural.nominative).toBe('времена');
			expect(vremya.declension.plural.genitive).toBe('времён');
			expect(vremya.declension.plural.dative).toBe('временам');
			expect(vremya.declension.plural.accusative).toBe('времена');
			expect(vremya.declension.plural.instrumental).toBe('временами');
			expect(vremya.declension.plural.prepositional).toBe('временах');
		});

		it('should have correct declension for дочь', () => {
			const doch = irregularNouns['дочь'];
			
			expect(doch.declension.singular.nominative).toBe('дочь');
			expect(doch.declension.singular.genitive).toBe('дочери');
			expect(doch.declension.singular.dative).toBe('дочери');
			expect(doch.declension.singular.accusative).toBe('дочь');
			expect(doch.declension.singular.instrumental).toBe('дочерью');
			expect(doch.declension.singular.prepositional).toBe('дочери');
			
			expect(doch.declension.plural.nominative).toBe('дочери');
			expect(doch.declension.plural.genitive).toBe('дочерей');
			expect(doch.declension.plural.dative).toBe('дочерям');
			expect(doch.declension.plural.accusative).toBe('дочерей');
			expect(doch.declension.plural.instrumental).toBe('дочерьми');
			expect(doch.declension.plural.prepositional).toBe('дочерях');
		});

		it('should have correct declension for мать', () => {
			const mat = irregularNouns['мать'];
			
			expect(mat.declension.singular.nominative).toBe('мать');
			expect(mat.declension.singular.genitive).toBe('матери');
			expect(mat.declension.singular.instrumental).toBe('матерью');
			
			expect(mat.declension.plural.nominative).toBe('матери');
			expect(mat.declension.plural.genitive).toBe('матерей');
			expect(mat.declension.plural.instrumental).toBe('матерями');
		});

		it('should have correct declension for путь', () => {
			const put = irregularNouns['путь'];
			
			expect(put.declension.singular.nominative).toBe('путь');
			expect(put.declension.singular.genitive).toBe('пути');
			expect(put.declension.singular.dative).toBe('пути');
			expect(put.declension.singular.accusative).toBe('путь');
			expect(put.declension.singular.instrumental).toBe('путём');
			expect(put.declension.singular.prepositional).toBe('пути');
			
			expect(put.declension.plural.nominative).toBe('пути');
			expect(put.declension.plural.genitive).toBe('путей');
		});
	});

	describe('all irregular nouns should pass validation', () => {
		it('should validate all irregular noun declensions', () => {
			const words = Object.keys(irregularNouns);
			
			for (const word of words) {
				const declension = irregularNouns[word];
				expect(isValidDeclension(declension), 
					`Declension for "${word}" should be valid`).toBe(true);
			}
		});

		it('should have all required fields for each irregular noun', () => {
			const words = Object.keys(irregularNouns);
			
			for (const word of words) {
				const data = irregularNouns[word];
				
				expect(data.word).toBe(word);
				expect(data.gender).toBeDefined();
				expect(data.declension).toBeDefined();
				expect(data.declension.singular).toBeDefined();
				expect(data.declension.plural).toBeDefined();
				expect(data.verified).toBe(true);
				expect(data.irregular).toBe(true);
			}
		});

		it('should have all 6 cases in singular and plural', () => {
			const words = Object.keys(irregularNouns);
			const cases = ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional'];
			
			for (const word of words) {
				const { declension } = irregularNouns[word];
				
				for (const caseName of cases) {
					expect(declension.singular[caseName], 
						`${word}: singular ${caseName} should exist`).toBeDefined();
					expect(declension.plural[caseName], 
						`${word}: plural ${caseName} should exist`).toBeDefined();
				}
			}
		});
	});

	describe('hasIrregularData', () => {
		it('should return true for irregular words', () => {
			expect(hasIrregularData('время')).toBe(true);
			expect(hasIrregularData('дочь')).toBe(true);
			expect(hasIrregularData('мать')).toBe(true);
			expect(hasIrregularData('путь')).toBe(true);
		});

		it('should return false for regular words', () => {
			expect(hasIrregularData('стол')).toBe(false);
			expect(hasIrregularData('книга')).toBe(false);
			expect(hasIrregularData('окно')).toBe(false);
		});

		it('should return false for non-existent words', () => {
			expect(hasIrregularData('xyzabc')).toBe(false);
			expect(hasIrregularData('')).toBe(false);
		});
	});

	describe('getIrregularDeclension', () => {
		it('should return declension data for irregular words', () => {
			const vremya = getIrregularDeclension('время');
			expect(vremya).toBeDefined();
			expect(vremya.word).toBe('время');
			expect(vremya.declension.singular.nominative).toBe('время');
		});

		it('should return null for regular words', () => {
			expect(getIrregularDeclension('стол')).toBeNull();
			expect(getIrregularDeclension('книга')).toBeNull();
		});

		it('should return null for non-existent words', () => {
			expect(getIrregularDeclension('xyzabc')).toBeNull();
		});
	});

	describe('getIrregularWords', () => {
		it('should return array of irregular word forms', () => {
			const words = getIrregularWords();
			
			expect(Array.isArray(words)).toBe(true);
			expect(words.length).toBeGreaterThan(0);
			expect(words).toContain('время');
			expect(words).toContain('дочь');
			expect(words).toContain('мать');
			expect(words).toContain('путь');
		});

		it('should return at least 5 irregular words', () => {
			const words = getIrregularWords();
			expect(words.length).toBeGreaterThanOrEqual(5);
		});
	});
});
