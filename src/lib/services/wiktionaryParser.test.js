import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isValidDeclension, formatDeclensionForDisplay, areWordsEquivalent } from './wiktionaryParser.js';

describe('wiktionaryParser', () => {
	
	describe('isValidDeclension', () => {
		it('should return false for null or undefined', () => {
			expect(isValidDeclension(null)).toBe(false);
			expect(isValidDeclension(undefined)).toBe(false);
		});

		it('should return false if declension property is missing', () => {
			expect(isValidDeclension({})).toBe(false);
			expect(isValidDeclension({ word: 'test' })).toBe(false);
		});

		it('should return false if singular or plural is missing', () => {
			expect(isValidDeclension({ 
				declension: { singular: {} } 
			})).toBe(false);
			
			expect(isValidDeclension({ 
				declension: { plural: {} } 
			})).toBe(false);
		});

		it('should return false if too few forms exist', () => {
			const declension = {
				declension: {
					singular: {
						nominative: 'стол',
						genitive: 'стола'
					},
					plural: {
						nominative: 'столы'
					}
				}
			};
			expect(isValidDeclension(declension)).toBe(false);
		});

		it('should return false if all forms are identical (parsing failure)', () => {
			const declension = {
				declension: {
					singular: {
						nominative: 'стол',
						genitive: 'стол',
						dative: 'стол',
						accusative: 'стол',
						instrumental: 'стол',
						prepositional: 'стол'
					},
					plural: {
						nominative: 'стол',
						genitive: 'стол',
						dative: 'стол',
						accusative: 'стол',
						instrumental: 'стол',
						prepositional: 'стол'
					}
				}
			};
			expect(isValidDeclension(declension)).toBe(false);
		});

		it('should return false if singular and plural are exactly identical', () => {
			const declension = {
				declension: {
					singular: {
						nominative: 'стол',
						genitive: 'стола',
						dative: 'столу',
						accusative: 'стол',
						instrumental: 'столом',
						prepositional: 'столе'
					},
					plural: {
						nominative: 'стол',
						genitive: 'стола',
						dative: 'столу',
						accusative: 'стол',
						instrumental: 'столом',
						prepositional: 'столе'
					}
				}
			};
			expect(isValidDeclension(declension)).toBe(false);
		});

		it('should return true for valid masculine noun declension', () => {
			const declension = {
				declension: {
					singular: {
						nominative: 'стол',
						genitive: 'стола',
						dative: 'столу',
						accusative: 'стол',
						instrumental: 'столом',
						prepositional: 'столе'
					},
					plural: {
						nominative: 'столы',
						genitive: 'столов',
						dative: 'столам',
						accusative: 'столы',
						instrumental: 'столами',
						prepositional: 'столах'
					}
				}
			};
			expect(isValidDeclension(declension)).toBe(true);
		});

		it('should return true for valid feminine noun declension', () => {
			const declension = {
				declension: {
					singular: {
						nominative: 'книга',
						genitive: 'книги',
						dative: 'книге',
						accusative: 'книгу',
						instrumental: 'книгой',
						prepositional: 'книге'
					},
					plural: {
						nominative: 'книги',
						genitive: 'книг',
						dative: 'книгам',
						accusative: 'книги',
						instrumental: 'книгами',
						prepositional: 'книгах'
					}
				}
			};
			expect(isValidDeclension(declension)).toBe(true);
		});

		it('should return true for valid neuter noun declension', () => {
			const declension = {
				declension: {
					singular: {
						nominative: 'окно',
						genitive: 'окна',
						dative: 'окну',
						accusative: 'окно',
						instrumental: 'окном',
						prepositional: 'окне'
					},
					plural: {
						nominative: 'окна',
						genitive: 'окон',
						dative: 'окнам',
						accusative: 'окна',
						instrumental: 'окнами',
						prepositional: 'окнах'
					}
				}
			};
			expect(isValidDeclension(declension)).toBe(true);
		});

		it('should accept declensions with some identical forms (normal for neuter)', () => {
			const declension = {
				declension: {
					singular: {
						nominative: 'окно',
						genitive: 'окна',
						dative: 'окну',
						accusative: 'окно', // Same as nominative - this is normal
						instrumental: 'окном',
						prepositional: 'окне'
					},
					plural: {
						nominative: 'окна',
						genitive: 'окон',
						dative: 'окнам',
						accusative: 'окна', // Same as nominative - this is normal
						instrumental: 'окнами',
						prepositional: 'окнах'
					}
				}
			};
			expect(isValidDeclension(declension)).toBe(true);
		});

		it('should handle irregular nouns correctly', () => {
			const declension = {
				declension: {
					singular: {
						nominative: 'время',
						genitive: 'времени',
						dative: 'времени',
						accusative: 'время',
						instrumental: 'временем',
						prepositional: 'времени'
					},
					plural: {
						nominative: 'времена',
						genitive: 'времён',
						dative: 'временам',
						accusative: 'времена',
						instrumental: 'временами',
						prepositional: 'временах'
					}
				}
			};
			expect(isValidDeclension(declension)).toBe(true);
		});
	});

	describe('formatDeclensionForDisplay', () => {
		it('should return "-" for all forms when declension is null', () => {
			const result = formatDeclensionForDisplay(null);
			
			expect(result.declension.singular.nominative).toBe('-');
			expect(result.declension.singular.genitive).toBe('-');
			expect(result.declension.plural.nominative).toBe('-');
			expect(result.isFallback).toBe(true);
			expect(result.error).toBe('Declension data unavailable');
		});

		it('should return "-" for all forms when declension is invalid', () => {
			const invalidDeclension = {
				word: 'test',
				declension: {
					singular: {
						nominative: 'test',
						genitive: 'test',
						dative: 'test',
						accusative: 'test',
						instrumental: 'test',
						prepositional: 'test'
					},
					plural: {
						nominative: 'test',
						genitive: 'test',
						dative: 'test',
						accusative: 'test',
						instrumental: 'test',
						prepositional: 'test'
					}
				}
			};
			
			const result = formatDeclensionForDisplay(invalidDeclension);
			
			expect(result.declension.singular.nominative).toBe('-');
			expect(result.isFallback).toBe(true);
		});

		it('should return original declension when valid', () => {
			const validDeclension = {
				word: 'стол',
				declension: {
					singular: {
						nominative: 'стол',
						genitive: 'стола',
						dative: 'столу',
						accusative: 'стол',
						instrumental: 'столом',
						prepositional: 'столе'
					},
					plural: {
						nominative: 'столы',
						genitive: 'столов',
						dative: 'столам',
						accusative: 'столы',
						instrumental: 'столами',
						prepositional: 'столах'
					}
				}
			};
			
			const result = formatDeclensionForDisplay(validDeclension);
			
			expect(result.declension.singular.nominative).toBe('стол');
			expect(result.declension.singular.genitive).toBe('стола');
			expect(result.declension.plural.nominative).toBe('столы');
			expect(result.isFallback).toBeUndefined();
		});
	});

	describe('areWordsEquivalent', () => {
		it('should match identical words', () => {
			expect(areWordsEquivalent('стол', 'стол')).toBe(true);
		});

		it('should match words ignoring case', () => {
			expect(areWordsEquivalent('Стол', 'стол')).toBe(true);
			expect(areWordsEquivalent('СТОЛ', 'стол')).toBe(true);
		});

		it('should match words ignoring stress marks', () => {
			expect(areWordsEquivalent('во́да', 'вода')).toBe(true);
			expect(areWordsEquivalent('столо́в', 'столов')).toBe(true);
		});

		it('should match ё and е when ignoreYo is true', () => {
			expect(areWordsEquivalent('берёза', 'береза', true)).toBe(true);
			expect(areWordsEquivalent('ребёнок', 'ребенок', true)).toBe(true);
		});

		it('should NOT match ё and е when ignoreYo is false', () => {
			expect(areWordsEquivalent('берёза', 'береза', false)).toBe(false);
			expect(areWordsEquivalent('ребёнок', 'ребенок', false)).toBe(false);
		});

		it('should return false for different words', () => {
			expect(areWordsEquivalent('стол', 'стул')).toBe(false);
			expect(areWordsEquivalent('книга', 'книги')).toBe(false);
		});

		it('should handle whitespace', () => {
			expect(areWordsEquivalent(' стол ', 'стол')).toBe(true);
			expect(areWordsEquivalent('стол  ', '  стол')).toBe(true);
		});
	});
});
