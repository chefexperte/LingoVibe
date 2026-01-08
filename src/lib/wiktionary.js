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

/**
 * Fetch full declension data for a Russian noun
 * Returns all 6 cases in singular and plural forms
 * Uses fallback chain: Russian Wiktionary -> Irregular data -> English Wiktionary -> Rule-based
 * @param {string} word - The Russian word
 * @param {Object} metadata - Optional metadata (gender, animacy, translation)
 * @returns {Promise<Object>} Full declension data
 */
export async function fetchFullDeclension(word, metadata = {}) {
	// Import parsers dynamically to avoid circular dependencies
	const { parseFullDeclension, isValidDeclension, formatDeclensionForDisplay } = await import('./services/wiktionaryParser.js');
	const { fetchFromRussianWiktionary, inferGenderFromHTML, inferAnimacyFromHTML } = await import('./services/russianWiktionaryParser.js');
	const { getIrregularDeclension } = await import('./data/irregularNouns.js');
	
	// Check cache first
	const cacheKey = `full_${word}`;
	if (cache.has(cacheKey)) {
		return cache.get(cacheKey);
	}

	// Method 1: Try Russian Wiktionary (most reliable)
	try {
		console.log(`Fetching declension for "${word}" from Russian Wiktionary...`);
		const ruResult = await fetchFromRussianWiktionary(word);
		
		if (ruResult && isValidDeclension(ruResult)) {
			// Enrich with metadata
			const enrichedResult = {
				...ruResult,
				gender: ruResult.gender || metadata.gender || inferGender(word),
				animacy: ruResult.animacy || metadata.animacy || 'inanimate',
				transliteration: ruResult.transliteration || metadata.transliteration || '',
				translation: ruResult.translation || metadata.translation || word,
				sourceUrl: `https://ru.wiktionary.org/wiki/${encodeURIComponent(word)}`,
				fromWiktionary: true
			};
			
			cache.set(cacheKey, enrichedResult);
			console.log(`✓ Successfully parsed "${word}" from Russian Wiktionary`);
			return enrichedResult;
		}
	} catch (error) {
		console.log(`Russian Wiktionary failed for "${word}":`, error.message);
	}

	// Method 2: Try hardcoded irregular nouns
	const irregularData = getIrregularDeclension(word);
	if (irregularData && isValidDeclension(irregularData)) {
		console.log(`✓ Using hardcoded irregular data for "${word}"`);
		cache.set(cacheKey, irregularData);
		return irregularData;
	}

	// Method 3: Try English Wiktionary
	try {
		console.log(`Fetching declension for "${word}" from English Wiktionary...`);
		const params = new URLSearchParams({
			action: 'parse',
			page: word,
			prop: 'wikitext',
			format: 'json',
			origin: '*'
		});

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

		const response = await fetch(`${WIKTIONARY_API_URL}?${params}`, {
			headers: {
				'Accept': 'application/json'
			},
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (response.ok) {
			const data = await response.json();

			if (!data.error) {
				// Parse the wikitext to extract full declension information
				const wikitext = data.parse?.wikitext?.['*'] || '';
				const parsedData = parseFullDeclension(word, wikitext, metadata);

				if (isValidDeclension(parsedData)) {
					console.log(`✓ Successfully parsed "${word}" from English Wiktionary`);
					cache.set(cacheKey, parsedData);
					return parsedData;
				}
			}
		}
	} catch (error) {
		console.log(`English Wiktionary failed for "${word}":`, error.message);
	}

	// Method 4: Use rule-based fallback (will likely be invalid for irregular words)
	console.log(`⚠ Using rule-based fallback for "${word}" (may be incorrect)`);
	const fallback = generateFallbackDeclension(word, metadata);
	
	// Only cache if it passes validation, otherwise return formatted with "-"
	if (isValidDeclension(fallback)) {
		cache.set(cacheKey, fallback);
		return fallback;
	} else {
		// Return formatted version with "-" for missing data
		const formatted = formatDeclensionForDisplay(null);
		formatted.word = word;
		formatted.translation = metadata.translation || word;
		// Don't cache failed results
		return formatted;
	}
}

/**
 * Generate fallback declension based on Russian grammar rules
 * @param {string} word - The Russian word
 * @param {Object} metadata - Word metadata (gender, animacy, translation)
 * @returns {Object} Generated declension data
 */
function generateFallbackDeclension(word, metadata = {}) {
	// Import parser for declension generation
	const gender = metadata.gender || inferGender(word);
	const animacy = metadata.animacy || 'inanimate';
	
	const declension = {
		word: word,
		gender: gender,
		animacy: animacy,
		declension: {
			singular: {
				nominative: word,
				genitive: word,
				dative: word,
				accusative: word,
				instrumental: word,
				prepositional: word
			},
			plural: {
				nominative: word,
				genitive: word,
				dative: word,
				accusative: word,
				instrumental: word,
				prepositional: word
			}
		},
		transliteration: metadata.transliteration || '',
		translation: metadata.translation || word,
		sourceUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`,
		fromWiktionary: false,
		isFallback: true
	};

	// Apply basic declension patterns
	applyBasicDeclension(declension);

	return declension;
}

/**
 * Infer gender from word ending
 * @param {string} word - The Russian word
 * @returns {string} Inferred gender
 */
function inferGender(word) {
	// Masculine: consonant, -й, -ь (some)
	if (/[бвгджзклмнпрстфхцчшщ]$/.test(word) || /й$/.test(word)) {
		return 'masculine';
	}
	// Feminine: -а, -я, -ь (most)
	if (/[ая]$/.test(word) || /ь$/.test(word)) {
		return 'feminine';
	}
	// Neuter: -о, -е, -ё, -мя
	if (/[оеё]$/.test(word) || /мя$/.test(word)) {
		return 'neuter';
	}
	return 'masculine'; // Default
}

/**
 * Apply basic declension patterns to a word
 * @param {Object} declension - The declension object to populate
 */
function applyBasicDeclension(declension) {
	const word = declension.word;
	const gender = declension.gender;
	const animacy = declension.animacy;

	if (gender === 'masculine') {
		// Hard consonant ending
		if (!/[ьйяеёюи]$/.test(word)) {
			declension.declension.singular.genitive = word + 'а';
			declension.declension.singular.dative = word + 'у';
			declension.declension.singular.accusative = animacy === 'animate' ? word + 'а' : word;
			declension.declension.singular.instrumental = word + 'ом';
			declension.declension.singular.prepositional = word + 'е';
		}
		// Soft ending (ь, й)
		else if (/[ьй]$/.test(word)) {
			const stem = word.slice(0, -1);
			declension.declension.singular.genitive = stem + 'я';
			declension.declension.singular.dative = stem + 'ю';
			declension.declension.singular.accusative = animacy === 'animate' ? stem + 'я' : word;
			declension.declension.singular.instrumental = stem + 'ем';
			declension.declension.singular.prepositional = stem + 'е';
		}
	} else if (gender === 'feminine') {
		// -а ending
		if (/а$/.test(word)) {
			const stem = word.slice(0, -1);
			declension.declension.singular.genitive = stem + 'ы';
			declension.declension.singular.dative = stem + 'е';
			declension.declension.singular.accusative = stem + 'у';
			declension.declension.singular.instrumental = stem + 'ой';
			declension.declension.singular.prepositional = stem + 'е';
		}
		// -я ending
		else if (/я$/.test(word)) {
			const stem = word.slice(0, -1);
			declension.declension.singular.genitive = stem + 'и';
			declension.declension.singular.dative = stem + 'е';
			declension.declension.singular.accusative = stem + 'ю';
			declension.declension.singular.instrumental = stem + 'ей';
			declension.declension.singular.prepositional = stem + 'е';
		}
		// -ь ending
		else if (/ь$/.test(word)) {
			const stem = word.slice(0, -1);
			declension.declension.singular.genitive = stem + 'и';
			declension.declension.singular.dative = stem + 'и';
			declension.declension.singular.accusative = word;
			declension.declension.singular.instrumental = stem + 'ью';
			declension.declension.singular.prepositional = stem + 'и';
		}
	} else if (gender === 'neuter') {
		// -о ending
		if (/о$/.test(word)) {
			const stem = word.slice(0, -1);
			declension.declension.singular.genitive = stem + 'а';
			declension.declension.singular.dative = stem + 'у';
			declension.declension.singular.accusative = word;
			declension.declension.singular.instrumental = stem + 'ом';
			declension.declension.singular.prepositional = stem + 'е';
		}
		// -е or -ё ending
		else if (/[её]$/.test(word)) {
			const stem = word.slice(0, -1);
			declension.declension.singular.genitive = stem + 'я';
			declension.declension.singular.dative = stem + 'ю';
			declension.declension.singular.accusative = word;
			declension.declension.singular.instrumental = stem + 'ем';
			declension.declension.singular.prepositional = stem + 'е';
		}
	}
}
