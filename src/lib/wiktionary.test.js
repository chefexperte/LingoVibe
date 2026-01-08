import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchFullDeclension, clearCache } from './wiktionary.js';
import { isValidDeclension } from './services/wiktionaryParser.js';

/**
 * Integration tests for the complete declension fetching system
 * Tests the fallback chain: Russian Wiktionary -> Irregular data -> English Wiktionary -> Rule-based
 */
describe('wiktionary integration', () => {
	
	beforeEach(() => {
		clearCache();
	});

	describe('fetchFullDeclension with irregular nouns', () => {
		it('should fetch declension for irregular noun "время" from irregular data', async () => {
			const result = await fetchFullDeclension('время', {
				gender: 'neuter',
				translation: 'time'
			});
			
			expect(result).toBeDefined();
			expect(result.word).toBe('время');
			
			// Check singular forms
			expect(result.declension.singular.nominative).toBe('время');
			expect(result.declension.singular.genitive).toBe('времени');
			expect(result.declension.singular.dative).toBe('времени');
			expect(result.declension.singular.instrumental).toBe('временем');
			
			// Check plural forms
			expect(result.declension.plural.nominative).toBe('времена');
			expect(result.declension.plural.genitive).toBe('времён');
			expect(result.declension.plural.dative).toBe('временам');
			
			// Verify it passes validation
			expect(isValidDeclension(result)).toBe(true);
		}, 15000);

		it('should fetch declension for irregular noun "дочь" from irregular data', async () => {
			const result = await fetchFullDeclension('дочь', {
				gender: 'feminine',
				translation: 'daughter'
			});
			
			expect(result).toBeDefined();
			expect(result.word).toBe('дочь');
			
			// Check singular forms
			expect(result.declension.singular.nominative).toBe('дочь');
			expect(result.declension.singular.genitive).toBe('дочери');
			expect(result.declension.singular.instrumental).toBe('дочерью');
			
			// Check plural forms
			expect(result.declension.plural.nominative).toBe('дочери');
			expect(result.declension.plural.genitive).toBe('дочерей');
			// Both "дочерями" and "дочерьми" are valid (Russian Wiktionary prefers first)
			expect(['дочерями', 'дочерьми']).toContain(result.declension.plural.instrumental);
			
			// Verify it passes validation
			expect(isValidDeclension(result)).toBe(true);
		}, 15000);

		it('should fetch declension for irregular noun "мать" from irregular data', async () => {
			const result = await fetchFullDeclension('мать', {
				gender: 'feminine',
				translation: 'mother'
			});
			
			expect(result).toBeDefined();
			expect(result.word).toBe('мать');
			
			// Check singular forms
			expect(result.declension.singular.nominative).toBe('мать');
			expect(result.declension.singular.genitive).toBe('матери');
			expect(result.declension.singular.instrumental).toBe('матерью');
			
			// Check plural forms
			expect(result.declension.plural.nominative).toBe('матери');
			expect(result.declension.plural.genitive).toBe('матерей');
			
			// Verify it passes validation
			expect(isValidDeclension(result)).toBe(true);
		}, 15000);

		it('should fetch declension for irregular noun "путь" from irregular data', async () => {
			const result = await fetchFullDeclension('путь', {
				gender: 'masculine',
				translation: 'way/path'
			});
			
			expect(result).toBeDefined();
			expect(result.word).toBe('путь');
			
			// Check singular forms
			expect(result.declension.singular.nominative).toBe('путь');
			expect(result.declension.singular.genitive).toBe('пути');
			expect(result.declension.singular.instrumental).toBe('путём');
			
			// Check plural forms
			expect(result.declension.plural.nominative).toBe('пути');
			expect(result.declension.plural.genitive).toBe('путей');
			
			// Verify it passes validation
			expect(isValidDeclension(result)).toBe(true);
		}, 15000);

		it('should fetch declension for irregular noun "человек" with suppletive plural', async () => {
			const result = await fetchFullDeclension('человек', {
				gender: 'masculine',
				translation: 'person'
			});
			
			expect(result).toBeDefined();
			expect(result.word).toBe('человек');
			
			// Check singular
			expect(result.declension.singular.nominative).toBe('человек');
			
			// Check suppletive plural
			expect(result.declension.plural.nominative).toBe('люди');
			expect(result.declension.plural.genitive).toBe('людей');
			
			// Verify it passes validation
			expect(isValidDeclension(result)).toBe(true);
		}, 15000);
	});

	describe('fetchFullDeclension validation', () => {
		it('should validate regular masculine noun declension', async () => {
			const result = await fetchFullDeclension('стол', {
				gender: 'masculine',
				translation: 'table'
			});
			
			expect(result).toBeDefined();
			expect(isValidDeclension(result)).toBe(true);
			
			// Should have different singular and plural forms
			const singNom = result.declension.singular.nominative;
			const plurNom = result.declension.plural.nominative;
			expect(singNom).not.toBe(plurNom);
		}, 15000);

		it('should validate regular feminine noun declension', async () => {
			const result = await fetchFullDeclension('книга', {
				gender: 'feminine',
				translation: 'book'
			});
			
			expect(result).toBeDefined();
			expect(isValidDeclension(result)).toBe(true);
			
			// Should have variety in forms
			const forms = Object.values(result.declension.singular);
			const uniqueForms = new Set(forms);
			expect(uniqueForms.size).toBeGreaterThan(1);
		}, 15000);

		it('should validate regular neuter noun declension', async () => {
			const result = await fetchFullDeclension('окно', {
				gender: 'neuter',
				translation: 'window'
			});
			
			expect(result).toBeDefined();
			expect(isValidDeclension(result)).toBe(true);
		}, 15000);
	});

	describe('fetchFullDeclension caching', () => {
		it('should cache results', async () => {
			const first = await fetchFullDeclension('время', { translation: 'time' });
			const second = await fetchFullDeclension('время', { translation: 'time' });
			
			// Should return the same cached object
			expect(first).toBe(second);
		}, 15000);

		it('should use cache across different calls', async () => {
			await fetchFullDeclension('дочь', { translation: 'daughter' });
			
			// Second call should be much faster (from cache)
			const start = Date.now();
			const result = await fetchFullDeclension('дочь', { translation: 'daughter' });
			const duration = Date.now() - start;
			
			expect(result).toBeDefined();
			expect(duration).toBeLessThan(50); // Should be nearly instant from cache
		}, 15000);
	});

	describe('fetchFullDeclension metadata enrichment', () => {
		it('should include provided metadata', async () => {
			const result = await fetchFullDeclension('стол', {
				gender: 'masculine',
				animacy: 'inanimate',
				translation: 'table',
				transliteration: 'stol'
			});
			
			expect(result.gender).toBe('masculine');
			expect(result.animacy).toBe('inanimate');
			expect(result.translation).toBe('table');
		}, 15000);

		it('should have sourceUrl field', async () => {
			const result = await fetchFullDeclension('время');
			
			expect(result.sourceUrl).toBeDefined();
			expect(result.sourceUrl).toContain('wiktionary');
		}, 15000);

		it('should mark fromWiktionary correctly', async () => {
			const result = await fetchFullDeclension('время');
			
			expect(result.fromWiktionary).toBe(true);
		}, 15000);
	});

	describe('fetchFullDeclension error handling', () => {
		it('should handle non-existent words gracefully', async () => {
			const result = await fetchFullDeclension('xyzabc123nonexistent', {
				translation: 'unknown'
			});
			
			expect(result).toBeDefined();
			// Should return formatted version with "-" for missing data
			// or fallback based on rules
		}, 15000);

		it('should return valid structure even for unknown words', async () => {
			const result = await fetchFullDeclension('qwertyuiop', {
				gender: 'masculine',
				translation: 'test'
			});
			
			expect(result).toBeDefined();
			expect(result.declension).toBeDefined();
			expect(result.declension.singular).toBeDefined();
			expect(result.declension.plural).toBeDefined();
		}, 15000);
	});
});
