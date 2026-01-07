/**
 * Wiktionary API integration for fetching Russian word data and declensions
 */

const WIKTIONARY_API_URL = 'https://en.wiktionary.org/w/api.php';
const cache = new Map();

/**
 * Fallback data for Russian words when API is unavailable
 */
const fallbackData = {
	'стол': {
		word: 'стол',
		transliteration: 'stol',
		translation: 'table',
		cases: {
			nominative: 'стол',
			accusative: 'стол',
			genitive: 'стола'
		}
	},
	'книга': {
		word: 'книга',
		transliteration: 'kniga',
		translation: 'book',
		cases: {
			nominative: 'книга',
			accusative: 'книгу',
			genitive: 'книги'
		}
	},
	'окно': {
		word: 'окно',
		transliteration: 'okno',
		translation: 'window',
		cases: {
			nominative: 'окно',
			accusative: 'окно',
			genitive: 'окна'
		}
	},
	'студент': {
		word: 'студент',
		transliteration: 'student',
		translation: 'student',
		cases: {
			nominative: 'студент',
			accusative: 'студента',
			genitive: 'студента'
		}
	},
	'вода': {
		word: 'вода',
		transliteration: 'voda',
		translation: 'water',
		cases: {
			nominative: 'вода',
			accusative: 'воду',
			genitive: 'воды'
		}
	}
};

/**
 * Fetch word data from Wiktionary API
 * @param {string} word - The Russian word to look up
 * @returns {Promise<Object>} Word data with declensions
 */
export async function fetchWordData(word) {
	// Check cache first
	if (cache.has(word)) {
		return cache.get(word);
	}

	// Return fallback data if available
	if (fallbackData[word]) {
		cache.set(word, fallbackData[word]);
		return fallbackData[word];
	}

	try {
		const params = new URLSearchParams({
			action: 'parse',
			page: word,
			prop: 'wikitext',
			format: 'json',
			origin: '*'
		});

		const response = await fetch(`${WIKTIONARY_API_URL}?${params}`, {
			headers: {
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		if (data.error) {
			throw new Error(data.error.info);
		}

		// Parse the wikitext to extract declension information
		const wikitext = data.parse?.wikitext?.['*'] || '';
		const parsedData = parseRussianDeclension(word, wikitext);

		// Cache the result
		cache.set(word, parsedData);

		return parsedData;
	} catch (error) {
		console.error(`Error fetching word data for "${word}":`, error);

		// Return fallback data or basic structure
		const fallback = {
			word: word,
			transliteration: word,
			translation: word,
			cases: {
				nominative: word,
				accusative: word,
				genitive: word
			},
			error: error.message
		};

		cache.set(word, fallback);
		return fallback;
	}
}

/**
 * Parse Russian declension from Wiktionary wikitext
 * @param {string} word - The word being parsed
 * @param {string} wikitext - The wikitext from Wiktionary
 * @returns {Object} Parsed word data
 */
function parseRussianDeclension(word, wikitext) {
	// Basic parsing - extract declension table if present
	// This is a simplified parser that looks for common patterns

	const result = {
		word: word,
		transliteration: extractTransliteration(wikitext) || word,
		translation: extractTranslation(wikitext) || word,
		cases: {
			nominative: word,
			accusative: word,
			genitive: word
		}
	};

	// Try to extract case forms from declension tables
	const nominativeMatch = wikitext.match(/\|nom_sg=([^\|}\n]+)/);
	const accusativeMatch = wikitext.match(/\|acc_sg=([^\|}\n]+)/);
	const genitiveMatch = wikitext.match(/\|gen_sg=([^\|}\n]+)/);

	if (nominativeMatch) {
		result.cases.nominative = nominativeMatch[1].trim();
	}
	if (accusativeMatch) {
		result.cases.accusative = accusativeMatch[1].trim();
	}
	if (genitiveMatch) {
		result.cases.genitive = genitiveMatch[1].trim();
	}

	return result;
}

/**
 * Extract transliteration from wikitext
 * @param {string} wikitext - The wikitext content
 * @returns {string|null} Transliteration or null
 */
function extractTransliteration(wikitext) {
	const match = wikitext.match(/\|tr=([^\|}\n]+)/);
	return match ? match[1].trim() : null;
}

/**
 * Extract English translation from wikitext
 * @param {string} wikitext - The wikitext content
 * @returns {string|null} Translation or null
 */
function extractTranslation(wikitext) {
	// Look for English definition
	const match = wikitext.match(/# \[\[([^\]]+)\]\]/);
	if (match) {
		return match[1].trim();
	}

	// Alternative pattern
	const match2 = wikitext.match(/# ([^\n]+)/);
	if (match2) {
		const translation = match2[1].trim();
		// Remove wiki markup
		return translation.replace(/\[\[|\]\]|{{|}}/g, '');
	}

	return null;
}

/**
 * Fetch multiple words in parallel
 * @param {Array<string>} words - Array of Russian words
 * @returns {Promise<Array<Object>>} Array of word data
 */
export async function fetchMultipleWords(words) {
	const promises = words.map(word => fetchWordData(word));
	return Promise.all(promises);
}

/**
 * Get fallback data for a word (for offline/testing)
 * @param {string} word - The Russian word
 * @returns {Object} Fallback word data
 */
export function getFallbackData(word) {
	return fallbackData[word] || {
		word: word,
		transliteration: word,
		translation: word,
		cases: {
			nominative: word,
			accusative: word,
			genitive: word
		}
	};
}

/**
 * Get all available fallback words
 * @returns {Array<Object>} Array of all fallback word data
 */
export function getAllFallbackWords() {
	return Object.values(fallbackData);
}

/**
 * Clear the cache
 */
export function clearCache() {
	cache.clear();
}
