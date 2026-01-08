/**
 * Enhanced Wiktionary parser for extracting full Russian noun declensions
 * Parses wikitext to extract all 6 cases in singular and plural forms
 */

/**
 * Parse full declension table from Wiktionary wikitext
 * @param {string} word - The Russian word
 * @param {string} wikitext - The wikitext from Wiktionary
 * @param {Object} metadata - Additional word metadata (gender, animacy)
 * @returns {Object} Full declension data
 */
export function parseFullDeclension(word, wikitext, metadata = {}) {
	const declension = {
		word: word,
		gender: metadata.gender || extractGender(wikitext),
		animacy: metadata.animacy || extractAnimacy(wikitext),
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
		transliteration: extractTransliteration(wikitext) || '',
		translation: metadata.translation || extractTranslation(wikitext) || '',
		sourceUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`,
		fromWiktionary: true
	};

	// Try to parse declension table from wikitext
	parseDeclensionTable(wikitext, declension);

	return declension;
}

/**
 * Parse declension table from wikitext template
 * @param {string} wikitext - The wikitext content
 * @param {Object} declension - The declension object to populate
 */
function parseDeclensionTable(wikitext, declension) {
	// Pattern 1: {{ru-noun-table}} templates
	const tableMatch = wikitext.match(/{{ru-noun-table\|([^}]+)}}/);
	if (tableMatch) {
		parseRuNounTable(tableMatch[1], declension);
		return;
	}

	// Pattern 2: Direct case parameters
	const cases = ['nom', 'gen', 'dat', 'acc', 'ins', 'prp'];
	const caseNames = {
		'nom': 'nominative',
		'gen': 'genitive',
		'dat': 'dative',
		'acc': 'accusative',
		'ins': 'instrumental',
		'prp': 'prepositional'
	};

	// Try to extract singular forms
	cases.forEach(shortCase => {
		const pattern = new RegExp(`\\|${shortCase}_sg=([^\\|\\}\\n]+)`, 'i');
		const match = wikitext.match(pattern);
		if (match) {
			const value = cleanWikitextValue(match[1]);
			if (value) {
				declension.declension.singular[caseNames[shortCase]] = value;
			}
		}
	});

	// Try to extract plural forms
	cases.forEach(shortCase => {
		const pattern = new RegExp(`\\|${shortCase}_pl=([^\\|\\}\\n]+)`, 'i');
		const match = wikitext.match(pattern);
		if (match) {
			const value = cleanWikitextValue(match[1]);
			if (value) {
				declension.declension.plural[caseNames[shortCase]] = value;
			}
		}
	});

	// Alternative patterns: |1= (nominative), |2= (genitive), etc.
	const altPattern = /\|([1-6])=([^\|\}\n]+)/g;
	let altMatch;
	const caseOrder = ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional'];
	
	while ((altMatch = altPattern.exec(wikitext)) !== null) {
		const caseIndex = parseInt(altMatch[1]) - 1;
		if (caseIndex >= 0 && caseIndex < 6) {
			const value = cleanWikitextValue(altMatch[2]);
			if (value) {
				declension.declension.singular[caseOrder[caseIndex]] = value;
			}
		}
	}
}

/**
 * Parse {{ru-noun-table}} template
 * @param {string} tableContent - Content of the template
 * @param {Object} declension - The declension object to populate
 */
function parseRuNounTable(tableContent, declension) {
	// This is a simplified parser - real implementation would need to handle
	// more complex template logic
	const parts = tableContent.split('|');
	
	// Often the first part is the stem
	if (parts.length > 0) {
		const stem = parts[0].trim();
		
		// Try to construct basic forms
		// This is highly simplified - actual Russian declension is complex
		if (declension.gender === 'masculine') {
			applyMasculineDeclension(stem, declension);
		} else if (declension.gender === 'feminine') {
			applyFeminineDeclension(stem, declension);
		} else if (declension.gender === 'neuter') {
			applyNeuterDeclension(stem, declension);
		}
	}
}

/**
 * Apply basic masculine declension patterns
 * @param {string} stem - Word stem
 * @param {Object} declension - The declension object to populate
 */
function applyMasculineDeclension(stem, declension) {
	const word = declension.word;
	
	// Hard consonant ending
	if (!/[ьйяеёюи]$/.test(word)) {
		declension.declension.singular.genitive = stem + 'а';
		declension.declension.singular.dative = stem + 'у';
		declension.declension.singular.instrumental = stem + 'ом';
		declension.declension.singular.prepositional = stem + 'е';
		
		// Accusative depends on animacy
		if (declension.animacy === 'animate') {
			declension.declension.singular.accusative = declension.declension.singular.genitive;
		}
	}
	// Soft ending (ь, й)
	else if (/[ьй]$/.test(word)) {
		const softStem = word.slice(0, -1);
		declension.declension.singular.genitive = softStem + 'я';
		declension.declension.singular.dative = softStem + 'ю';
		declension.declension.singular.accusative = declension.animacy === 'animate' ? softStem + 'я' : word;
		declension.declension.singular.instrumental = softStem + 'ем';
		declension.declension.singular.prepositional = softStem + 'е';
	}
}

/**
 * Apply basic feminine declension patterns
 * @param {string} stem - Word stem
 * @param {Object} declension - The declension object to populate
 */
function applyFeminineDeclension(stem, declension) {
	const word = declension.word;
	
	// -а ending
	if (/а$/.test(word)) {
		const hardStem = word.slice(0, -1);
		declension.declension.singular.genitive = hardStem + 'ы';
		declension.declension.singular.dative = hardStem + 'е';
		declension.declension.singular.accusative = hardStem + 'у';
		declension.declension.singular.instrumental = hardStem + 'ой';
		declension.declension.singular.prepositional = hardStem + 'е';
	}
	// -я ending
	else if (/я$/.test(word)) {
		const softStem = word.slice(0, -1);
		declension.declension.singular.genitive = softStem + 'и';
		declension.declension.singular.dative = softStem + 'е';
		declension.declension.singular.accusative = softStem + 'ю';
		declension.declension.singular.instrumental = softStem + 'ей';
		declension.declension.singular.prepositional = softStem + 'е';
	}
	// -ь ending
	else if (/ь$/.test(word)) {
		const softStem = word.slice(0, -1);
		declension.declension.singular.genitive = softStem + 'и';
		declension.declension.singular.dative = softStem + 'и';
		declension.declension.singular.accusative = word;
		declension.declension.singular.instrumental = softStem + 'ью';
		declension.declension.singular.prepositional = softStem + 'и';
	}
}

/**
 * Apply basic neuter declension patterns
 * @param {string} stem - Word stem
 * @param {Object} declension - The declension object to populate
 */
function applyNeuterDeclension(stem, declension) {
	const word = declension.word;
	
	// -о ending
	if (/о$/.test(word)) {
		const hardStem = word.slice(0, -1);
		declension.declension.singular.genitive = hardStem + 'а';
		declension.declension.singular.dative = hardStem + 'у';
		declension.declension.singular.accusative = word;
		declension.declension.singular.instrumental = hardStem + 'ом';
		declension.declension.singular.prepositional = hardStem + 'е';
	}
	// -е or -ё ending
	else if (/[её]$/.test(word)) {
		const softStem = word.slice(0, -1);
		declension.declension.singular.genitive = softStem + 'я';
		declension.declension.singular.dative = softStem + 'ю';
		declension.declension.singular.accusative = word;
		declension.declension.singular.instrumental = softStem + 'ем';
		declension.declension.singular.prepositional = softStem + 'е';
	}
	// -ие ending
	else if (/ие$/.test(word)) {
		const softStem = word.slice(0, -2);
		declension.declension.singular.genitive = softStem + 'ия';
		declension.declension.singular.dative = softStem + 'ию';
		declension.declension.singular.accusative = word;
		declension.declension.singular.instrumental = softStem + 'ием';
		declension.declension.singular.prepositional = softStem + 'ии';
	}
}

/**
 * Extract gender from wikitext
 * @param {string} wikitext - The wikitext content
 * @returns {string} Gender: 'masculine', 'feminine', 'neuter', or ''
 */
function extractGender(wikitext) {
	if (/\|g=m\b|\|m\b|masculine/i.test(wikitext)) return 'masculine';
	if (/\|g=f\b|\|f\b|feminine/i.test(wikitext)) return 'feminine';
	if (/\|g=n\b|\|n\b|neuter/i.test(wikitext)) return 'neuter';
	return '';
}

/**
 * Extract animacy from wikitext
 * @param {string} wikitext - The wikitext content
 * @returns {string} Animacy: 'animate', 'inanimate', or 'inanimate' (default)
 */
function extractAnimacy(wikitext) {
	if (/\|a=an\b|animate/i.test(wikitext)) return 'animate';
	if (/\|a=in\b|inanimate/i.test(wikitext)) return 'inanimate';
	return 'inanimate'; // Default
}

/**
 * Extract transliteration from wikitext
 * @param {string} wikitext - The wikitext content
 * @returns {string|null} Transliteration or null
 */
function extractTransliteration(wikitext) {
	const match = wikitext.match(/\|tr=([^\|\}\n]+)/);
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
 * Clean wikitext value (remove markup, etc.)
 * @param {string} value - The value to clean
 * @returns {string} Cleaned value
 */
function cleanWikitextValue(value) {
	if (!value) return '';
	
	return value
		.trim()
		.replace(/\[\[([^\]]+)\]\]/g, '$1') // Remove wiki links
		.replace(/{{([^}]+)}}/g, '') // Remove templates
		.replace(/<[^>]+>/g, '') // Remove HTML tags
		.replace(/&nbsp;/g, ' ')
		.replace(/'/g, '') // Remove wiki markup quotes
		.trim();
}

/**
 * Normalize Russian text for comparison (remove stress marks)
 * @param {string} text - Russian text
 * @returns {string} Normalized text
 */
export function normalizeRussianText(text) {
	if (!text) return '';
	
	return text
		.toLowerCase()
		.replace(/́/g, '') // Remove stress mark (combining acute accent)
		.replace(/ё/g, 'е') // Optional: treat ё and е as equivalent
		.trim();
}

/**
 * Check if two Russian words are equivalent (ignoring stress marks)
 * @param {string} word1 - First word
 * @param {string} word2 - Second word
 * @param {boolean} ignoreYo - Whether to treat ё and е as the same (default: false)
 * @returns {boolean} True if words are equivalent
 */
export function areWordsEquivalent(word1, word2, ignoreYo = false) {
	const normalized1 = word1.toLowerCase().replace(/́/g, '').trim();
	const normalized2 = word2.toLowerCase().replace(/́/g, '').trim();
	
	if (normalized1 === normalized2) return true;
	
	if (ignoreYo) {
		const withoutYo1 = normalized1.replace(/ё/g, 'е');
		const withoutYo2 = normalized2.replace(/ё/g, 'е');
		return withoutYo1 === withoutYo2;
	}
	
	return false;
}

/**
 * Validation constants
 */
const MIN_REQUIRED_FORMS = 8; // Minimum forms needed for valid declension
const MIN_CASES_REQUIRED = 4; // Minimum cases for partial validation

/**
 * Validate that a declension object has valid, unique forms
 * @param {Object} declension - Declension object to validate
 * @returns {boolean} True if declension is valid
 */
export function isValidDeclension(declension) {
	if (!declension || !declension.declension) return false;
	
	const { singular, plural } = declension.declension;
	
	// Check that both singular and plural exist
	if (!singular || !plural) return false;
	
	// Collect all forms
	const allForms = [
		...Object.values(singular),
		...Object.values(plural)
	].filter(form => form); // Filter out empty values
	
	// Check 1: Must have at least MIN_REQUIRED_FORMS forms (not all 12 required - some may be missing)
	if (allForms.length < MIN_REQUIRED_FORMS) {
		console.warn('Declension validation failed: too few forms');
		return false;
	}
	
	// Check 2: No form should be empty string
	if (allForms.some(form => !form || form === '')) {
		console.warn('Declension validation failed: empty forms found');
		return false;
	}
	
	// Check 3: Not all forms should be identical (indicates parsing failure)
	const uniqueForms = new Set(allForms);
	if (uniqueForms.size === 1) {
		console.warn('Declension validation failed: all forms identical');
		return false;
	}
	
	// Check 4: Singular should have at least some different forms
	const singularForms = Object.values(singular).filter(f => f);
	const uniqueSingular = new Set(singularForms);
	if (singularForms.length >= 4 && uniqueSingular.size === 1) {
		console.warn('Declension validation failed: all singular forms identical');
		return false;
	}
	
	// Check 5: At least some variation between singular and plural
	// (but allow cases where they're the same, like neuter accusative)
	const singularSet = new Set(Object.values(singular).filter(f => f));
	const pluralSet = new Set(Object.values(plural).filter(f => f));
	const overlap = [...singularSet].filter(x => pluralSet.has(x));
	
	// If ALL singular forms appear in plural AND plural has no unique forms, it's likely wrong
	if (singularSet.size > 0 && overlap.length === singularSet.size && overlap.length === pluralSet.size) {
		console.warn('Declension validation failed: singular equals plural exactly');
		return false;
	}
	
	return true;
}

/**
 * Format declension for display, replacing invalid data with "-"
 * @param {Object} declension - Declension object
 * @returns {Object} Formatted declension with "-" for missing data
 */
export function formatDeclensionForDisplay(declension) {
	const emptyForm = {
		singular: {
			nominative: '-',
			genitive: '-',
			dative: '-',
			accusative: '-',
			instrumental: '-',
			prepositional: '-'
		},
		plural: {
			nominative: '-',
			genitive: '-',
			dative: '-',
			accusative: '-',
			instrumental: '-',
			prepositional: '-'
		}
	};
	
	if (!declension || !isValidDeclension(declension)) {
		return {
			word: declension?.word || '',
			gender: declension?.gender || 'unknown',
			animacy: declension?.animacy || 'unknown',
			declension: emptyForm,
			transliteration: declension?.transliteration || '',
			translation: declension?.translation || '',
			sourceUrl: declension?.sourceUrl || '',
			fromWiktionary: false,
			isFallback: true,
			error: 'Declension data unavailable'
		};
	}
	
	return declension;
}
