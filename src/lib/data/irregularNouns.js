/**
 * Hardcoded declension data for irregular Russian nouns
 * These are manually verified and used as fallback when Wiktionary parsing fails
 */

export const irregularNouns = {
	'время': {
		word: 'время',
		gender: 'neuter',
		animacy: 'inanimate',
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
		},
		transliteration: 'vremya',
		translation: 'time',
		sourceUrl: 'https://ru.wiktionary.org/wiki/время',
		fromWiktionary: true,
		verified: true,
		irregular: true,
		note: 'Irregular neuter noun with -мя stem'
	},
	'дочь': {
		word: 'дочь',
		gender: 'feminine',
		animacy: 'animate',
		declension: {
			singular: {
				nominative: 'дочь',
				genitive: 'дочери',
				dative: 'дочери',
				accusative: 'дочь',
				instrumental: 'дочерью',
				prepositional: 'дочери'
			},
			plural: {
				nominative: 'дочери',
				genitive: 'дочерей',
				dative: 'дочерям',
				accusative: 'дочерей',
				instrumental: 'дочерьми',
				prepositional: 'дочерях'
			}
		},
		transliteration: 'doch\'',
		translation: 'daughter',
		sourceUrl: 'https://ru.wiktionary.org/wiki/дочь',
		fromWiktionary: true,
		verified: true,
		irregular: true,
		note: 'Irregular feminine noun with consonant mutation'
	},
	'мать': {
		word: 'мать',
		gender: 'feminine',
		animacy: 'animate',
		declension: {
			singular: {
				nominative: 'мать',
				genitive: 'матери',
				dative: 'матери',
				accusative: 'мать',
				instrumental: 'матерью',
				prepositional: 'матери'
			},
			plural: {
				nominative: 'матери',
				genitive: 'матерей',
				dative: 'матерям',
				accusative: 'матерей',
				instrumental: 'матерями',
				prepositional: 'матерях'
			}
		},
		transliteration: 'mat\'',
		translation: 'mother',
		sourceUrl: 'https://ru.wiktionary.org/wiki/мать',
		fromWiktionary: true,
		verified: true,
		irregular: true,
		note: 'Irregular feminine noun with stem changes'
	},
	'путь': {
		word: 'путь',
		gender: 'masculine',
		animacy: 'inanimate',
		declension: {
			singular: {
				nominative: 'путь',
				genitive: 'пути',
				dative: 'пути',
				accusative: 'путь',
				instrumental: 'путём',
				prepositional: 'пути'
			},
			plural: {
				nominative: 'пути',
				genitive: 'путей',
				dative: 'путям',
				accusative: 'пути',
				instrumental: 'путями',
				prepositional: 'путях'
			}
		},
		transliteration: 'put\'',
		translation: 'way/path',
		sourceUrl: 'https://ru.wiktionary.org/wiki/путь',
		fromWiktionary: true,
		verified: true,
		irregular: true,
		note: 'Irregular masculine noun with mixed declension pattern'
	},
	'имя': {
		word: 'имя',
		gender: 'neuter',
		animacy: 'inanimate',
		declension: {
			singular: {
				nominative: 'имя',
				genitive: 'имени',
				dative: 'имени',
				accusative: 'имя',
				instrumental: 'именем',
				prepositional: 'имени'
			},
			plural: {
				nominative: 'имена',
				genitive: 'имён',
				dative: 'именам',
				accusative: 'имена',
				instrumental: 'именами',
				prepositional: 'именах'
			}
		},
		transliteration: 'imya',
		translation: 'name',
		sourceUrl: 'https://ru.wiktionary.org/wiki/имя',
		fromWiktionary: true,
		verified: true,
		irregular: true,
		note: 'Irregular neuter noun with -мя stem'
	},
	'знамя': {
		word: 'знамя',
		gender: 'neuter',
		animacy: 'inanimate',
		declension: {
			singular: {
				nominative: 'знамя',
				genitive: 'знамени',
				dative: 'знамени',
				accusative: 'знамя',
				instrumental: 'знаменем',
				prepositional: 'знамени'
			},
			plural: {
				nominative: 'знамёна',
				genitive: 'знамён',
				dative: 'знамёнам',
				accusative: 'знамёна',
				instrumental: 'знамёнами',
				prepositional: 'знамёнах'
			}
		},
		transliteration: 'znamya',
		translation: 'banner/flag',
		sourceUrl: 'https://ru.wiktionary.org/wiki/знамя',
		fromWiktionary: true,
		verified: true,
		irregular: true,
		note: 'Irregular neuter noun with -мя stem'
	},
	'человек': {
		word: 'человек',
		gender: 'masculine',
		animacy: 'animate',
		declension: {
			singular: {
				nominative: 'человек',
				genitive: 'человека',
				dative: 'человеку',
				accusative: 'человека',
				instrumental: 'человеком',
				prepositional: 'человеке'
			},
			plural: {
				nominative: 'люди',
				genitive: 'людей',
				dative: 'людям',
				accusative: 'людей',
				instrumental: 'людьми',
				prepositional: 'людях'
			}
		},
		transliteration: 'chelovek',
		translation: 'person',
		sourceUrl: 'https://ru.wiktionary.org/wiki/человек',
		fromWiktionary: true,
		verified: true,
		irregular: true,
		note: 'Highly irregular - uses suppletive plural (люди)'
	},
	'ребёнок': {
		word: 'ребёнок',
		gender: 'masculine',
		animacy: 'animate',
		declension: {
			singular: {
				nominative: 'ребёнок',
				genitive: 'ребёнка',
				dative: 'ребёнку',
				accusative: 'ребёнка',
				instrumental: 'ребёнком',
				prepositional: 'ребёнке'
			},
			plural: {
				nominative: 'дети',
				genitive: 'детей',
				dative: 'детям',
				accusative: 'детей',
				instrumental: 'детьми',
				prepositional: 'детях'
			}
		},
		transliteration: 'rebyonok',
		translation: 'child',
		sourceUrl: 'https://ru.wiktionary.org/wiki/ребёнок',
		fromWiktionary: true,
		verified: true,
		irregular: true,
		note: 'Highly irregular - uses suppletive plural (дети)'
	}
};

/**
 * Check if a word has hardcoded irregular declension data
 * @param {string} word - The Russian word
 * @returns {boolean} True if irregular data exists
 */
export function hasIrregularData(word) {
	return word in irregularNouns;
}

/**
 * Get irregular declension data for a word
 * @param {string} word - The Russian word
 * @returns {Object|null} Declension data or null
 */
export function getIrregularDeclension(word) {
	return irregularNouns[word] || null;
}

/**
 * Get all irregular words
 * @returns {Array<string>} List of irregular word forms
 */
export function getIrregularWords() {
	return Object.keys(irregularNouns);
}
