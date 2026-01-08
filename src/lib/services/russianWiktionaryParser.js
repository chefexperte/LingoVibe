/**
 * Russian Wiktionary HTML parser for extracting declension tables
 * ru.wiktionary.org has more complete and reliable Russian grammar data
 */

/**
 * Fetch and parse declension from Russian Wiktionary
 * @param {string} word - The Russian word
 * @returns {Promise<Object|null>} Declension data or null
 */
export async function fetchFromRussianWiktionary(word) {
	try {
		const url = `https://ru.wiktionary.org/api/rest_v1/page/html/${encodeURIComponent(word)}`;
		
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
		
		const response = await fetch(url, {
			headers: {
				'Accept': 'text/html'
			},
			signal: controller.signal
		});
		
		clearTimeout(timeoutId);
		
		if (!response.ok) {
			console.log(`Russian Wiktionary: HTTP ${response.status} for "${word}"`);
			return null;
		}
		
		const html = await response.text();
		return parseRussianWiktionaryHTML(word, html);
		
	} catch (error) {
		if (error.name === 'AbortError') {
			console.log(`Russian Wiktionary timeout for "${word}"`);
		} else {
			console.log(`Russian Wiktionary fetch error for "${word}":`, error.message);
		}
		return null;
	}
}

/**
 * Parse HTML from Russian Wiktionary to extract declension table
 * @param {string} word - The Russian word
 * @param {string} html - HTML content
 * @returns {Object|null} Parsed declension or null
 */
function parseRussianWiktionaryHTML(word, html) {
	try {
		// Look for inflection table patterns in Russian Wiktionary
		// Pattern 1: Standard inflection table with падеж headers
		const tableMatch = html.match(/<table[^>]*class="[^"]*inflection[^"]*"[^>]*>(.*?)<\/table>/is);
		if (tableMatch) {
			const tableHTML = tableMatch[1];
			const declension = extractDeclensionFromTable(word, tableHTML);
			if (declension) {
				return declension;
			}
		}
		
		// Pattern 2: Look for specific Russian case markers
		const declensionData = extractDeclensionFromHTML(word, html);
		if (declensionData) {
			return declensionData;
		}
		
		return null;
	} catch (error) {
		console.error(`Error parsing Russian Wiktionary HTML for "${word}":`, error);
		return null;
	}
}

/**
 * Extract declension from inflection table
 * @param {string} word - The word being parsed
 * @param {string} tableHTML - Table HTML content
 * @returns {Object|null} Declension object or null
 */
function extractDeclensionFromTable(word, tableHTML) {
	// Russian Wiktionary uses these case abbreviations
	const casePatterns = {
		nominative: /(?:И\.?м\.?|именительный)/i,
		genitive: /(?:Р\.?д\.?|родительный)/i,
		dative: /(?:Д\.?т\.?|дательный)/i,
		accusative: /(?:В\.?н\.?|винительный)/i,
		instrumental: /(?:Т\.?в\.?|творительный)/i,
		prepositional: /(?:П\.?р\.?|предложный)/i
	};
	
	const declension = {
		word: word,
		declension: {
			singular: {},
			plural: {}
		}
	};
	
	// Split into rows
	const rows = tableHTML.split(/<\/?tr[^>]*>/i).filter(r => r.trim());
	
	for (const row of rows) {
		// Extract cells from row
		const cells = extractCells(row);
		if (cells.length < 2) continue;
		
		// Find which case this row represents
		const caseLabel = cleanText(cells[0]);
		let caseName = null;
		
		for (const [name, pattern] of Object.entries(casePatterns)) {
			if (pattern.test(caseLabel)) {
				caseName = name;
				break;
			}
		}
		
		if (!caseName) continue;
		
		// Extract singular and plural forms
		// Usually: [case label] [singular] [plural]
		if (cells.length >= 2) {
			const singularForm = cleanText(cells[1]);
			if (singularForm && singularForm !== '—' && singularForm !== '-') {
				declension.declension.singular[caseName] = singularForm;
			}
		}
		
		if (cells.length >= 3) {
			const pluralForm = cleanText(cells[2]);
			if (pluralForm && pluralForm !== '—' && pluralForm !== '-') {
				declension.declension.plural[caseName] = pluralForm;
			}
		}
	}
	
	// Check if we got enough data
	const singularCount = Object.keys(declension.declension.singular).length;
	const pluralCount = Object.keys(declension.declension.plural).length;
	
	if (singularCount >= 4) { // At least 4 cases found
		return declension;
	}
	
	return null;
}

/**
 * Extract cells from a table row HTML
 * @param {string} rowHTML - Row HTML
 * @returns {Array<string>} Array of cell contents
 */
function extractCells(rowHTML) {
	const cells = [];
	const cellMatches = rowHTML.matchAll(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi);
	
	for (const match of cellMatches) {
		cells.push(match[1]);
	}
	
	return cells;
}

/**
 * Extract declension directly from HTML (fallback method)
 * @param {string} word - The word
 * @param {string} html - Full HTML
 * @returns {Object|null} Declension or null
 */
function extractDeclensionFromHTML(word, html) {
	// This is a more aggressive search for case forms
	// Look for patterns like "род. п. ед. ч." (genitive singular)
	
	const declension = {
		word: word,
		declension: {
			singular: { nominative: word },
			plural: {}
		}
	};
	
	// Pattern for finding case forms in definitions
	const patterns = [
		{ case: 'genitive', pattern: /род(?:ительный)?\.?\s*п\.?\s*ед\.?\s*ч\.?\s*[—-]\s*([а-яё]+)/i },
		{ case: 'dative', pattern: /дат(?:ельный)?\.?\s*п\.?\s*ед\.?\s*ч\.?\s*[—-]\s*([а-яё]+)/i },
		{ case: 'accusative', pattern: /вин(?:ительный)?\.?\s*п\.?\s*ед\.?\s*ч\.?\s*[—-]\s*([а-яё]+)/i },
		{ case: 'instrumental', pattern: /твор(?:ительный)?\.?\s*п\.?\s*ед\.?\s*ч\.?\s*[—-]\s*([а-яё]+)/i },
		{ case: 'prepositional', pattern: /предл(?:ожный)?\.?\s*п\.?\s*ед\.?\s*ч\.?\s*[—-]\s*([а-яё]+)/i }
	];
	
	let foundCount = 0;
	for (const { case: caseName, pattern } of patterns) {
		const match = html.match(pattern);
		if (match && match[1]) {
			declension.declension.singular[caseName] = match[1].trim();
			foundCount++;
		}
	}
	
	// Only return if we found at least 2 forms
	if (foundCount >= 2) {
		return declension;
	}
	
	return null;
}

/**
 * Clean text extracted from HTML
 * @param {string} text - Raw HTML text
 * @returns {string} Cleaned text
 */
function cleanText(text) {
	if (!text) return '';
	
	return text
		.replace(/<[^>]+>/g, '') // Remove HTML tags
		.replace(/&nbsp;/g, ' ')
		.replace(/&mdash;/g, '—')
		.replace(/&[a-z]+;/gi, '') // Remove other HTML entities
		.replace(/\[[^\]]+\]/g, '') // Remove reference markers
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Infer gender from Russian Wiktionary HTML
 * @param {string} html - HTML content
 * @returns {string} Gender or empty string
 */
export function inferGenderFromHTML(html) {
	if (/муж\.?(?:\s+род)?|masculine/i.test(html)) return 'masculine';
	if (/жен\.?(?:\s+род)?|feminine/i.test(html)) return 'feminine';
	if (/ср\.?(?:\s+род)?|neuter/i.test(html)) return 'neuter';
	return '';
}

/**
 * Infer animacy from Russian Wiktionary HTML
 * @param {string} html - HTML content
 * @returns {string} Animacy
 */
export function inferAnimacyFromHTML(html) {
	if (/одуш\.?|animate/i.test(html)) return 'animate';
	if (/неодуш\.?|inanimate/i.test(html)) return 'inanimate';
	return 'inanimate'; // Default
}
