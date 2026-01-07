/**
 * Sentence templates for context-based grammar quizzes
 * Each template requires a specific grammatical case
 */

export const sentenceTemplates = [
	// ACCUSATIVE CASE (direct object)
	{
		russian: 'Я вижу _____ .',
		english: 'I see the _____.',
		requiredCase: 'accusative',
		difficulty: 'common',
		explanation: 'After "вижу" (I see), we use the accusative case for the direct object.'
	},
	{
		russian: 'Я читаю _____ .',
		english: 'I am reading the _____.',
		requiredCase: 'accusative',
		difficulty: 'common',
		explanation: 'After "читаю" (I am reading), we use the accusative case for what is being read.'
	},
	{
		russian: 'Я люблю _____ .',
		english: 'I love _____.',
		requiredCase: 'accusative',
		difficulty: 'common',
		explanation: 'After "люблю" (I love), we use the accusative case for the object of affection.'
	},
	{
		russian: 'Я знаю _____ .',
		english: 'I know the _____.',
		requiredCase: 'accusative',
		difficulty: 'common',
		explanation: 'After "знаю" (I know), we use the accusative case for the direct object.'
	},
	{
		russian: 'Я пишу _____ .',
		english: 'I am writing _____.',
		requiredCase: 'accusative',
		difficulty: 'common',
		explanation: 'After "пишу" (I am writing), we use the accusative case for what is being written.'
	},
	{
		russian: 'Мы изучаем _____ .',
		english: 'We are studying _____.',
		requiredCase: 'accusative',
		difficulty: 'common',
		explanation: 'After "изучаем" (we are studying), we use the accusative case for what is being studied.'
	},
	{
		russian: 'Она покупает _____ .',
		english: 'She is buying _____.',
		requiredCase: 'accusative',
		difficulty: 'intermediate',
		explanation: 'After "покупает" (she is buying), we use the accusative case for what is being bought.'
	},

	// GENITIVE CASE (possession, "of")
	{
		russian: 'Это книга _____ .',
		english: 'This is the book of _____.',
		requiredCase: 'genitive',
		difficulty: 'common',
		explanation: 'To express possession ("of"), we use the genitive case.'
	},
	{
		russian: 'У меня нет _____ .',
		english: 'I don\'t have _____.',
		requiredCase: 'genitive',
		difficulty: 'common',
		explanation: 'After "нет" (there is no/not), we use the genitive case.'
	},
	{
		russian: 'Я боюсь _____ .',
		english: 'I am afraid of _____.',
		requiredCase: 'genitive',
		difficulty: 'intermediate',
		explanation: 'The verb "бояться" (to be afraid) requires the genitive case.'
	},
	{
		russian: 'Я жду _____ .',
		english: 'I am waiting for _____.',
		requiredCase: 'genitive',
		difficulty: 'intermediate',
		explanation: 'The verb "ждать" (to wait) requires the genitive case.'
	},
	{
		russian: 'Я хочу _____ .',
		english: 'I want _____.',
		requiredCase: 'genitive',
		difficulty: 'common',
		explanation: 'The verb "хотеть" (to want) often requires the genitive case.'
	},

	// DATIVE CASE (indirect object, "to")
	{
		russian: 'Я даю _____ подарок.',
		english: 'I give _____ a gift.',
		requiredCase: 'dative',
		difficulty: 'common',
		explanation: 'We use the dative case for the indirect object (to whom something is given).'
	},
	{
		russian: 'Я помогаю _____ .',
		english: 'I help _____.',
		requiredCase: 'dative',
		difficulty: 'common',
		explanation: 'The verb "помогать" (to help) requires the dative case.'
	},
	{
		russian: 'Я звоню _____ .',
		english: 'I am calling _____.',
		requiredCase: 'dative',
		difficulty: 'intermediate',
		explanation: 'The verb "звонить" (to call) requires the dative case.'
	},
	{
		russian: 'Я пишу письмо _____ .',
		english: 'I am writing a letter to _____.',
		requiredCase: 'dative',
		difficulty: 'intermediate',
		explanation: 'We use the dative case for the recipient of a letter (to whom).'
	},
	{
		russian: 'Это нравится _____ .',
		english: '_____ likes this.',
		requiredCase: 'dative',
		difficulty: 'intermediate',
		explanation: 'The verb "нравиться" (to like) uses the dative case for the person who likes.'
	},

	// INSTRUMENTAL CASE (instrument, "with")
	{
		russian: 'Я говорю с _____ .',
		english: 'I am talking with _____.',
		requiredCase: 'instrumental',
		difficulty: 'common',
		explanation: 'After the preposition "с" (with), we use the instrumental case.'
	},
	{
		russian: 'Я пишу _____ .',
		english: 'I am writing with _____.',
		requiredCase: 'instrumental',
		difficulty: 'common',
		explanation: 'We use the instrumental case to show the instrument used to perform an action.'
	},
	{
		russian: 'Я работаю _____ .',
		english: 'I work as _____.',
		requiredCase: 'instrumental',
		difficulty: 'intermediate',
		explanation: 'We use the instrumental case to indicate a profession or role.'
	},
	{
		russian: 'Я доволен _____ .',
		english: 'I am satisfied with _____.',
		requiredCase: 'instrumental',
		difficulty: 'intermediate',
		explanation: 'After "доволен" (satisfied), we use the instrumental case.'
	},
	{
		russian: 'Я занимаюсь _____ .',
		english: 'I am engaged in _____.',
		requiredCase: 'instrumental',
		difficulty: 'intermediate',
		explanation: 'The verb "заниматься" (to be engaged in) requires the instrumental case.'
	},
	{
		russian: 'Я интересуюсь _____ .',
		english: 'I am interested in _____.',
		requiredCase: 'instrumental',
		difficulty: 'intermediate',
		explanation: 'The verb "интересоваться" (to be interested) requires the instrumental case.'
	},
	{
		russian: 'Я горжусь _____ .',
		english: 'I am proud of _____.',
		requiredCase: 'instrumental',
		difficulty: 'advanced',
		explanation: 'The verb "гордиться" (to be proud) requires the instrumental case.'
	},

	// PREPOSITIONAL CASE (location, "about")
	{
		russian: 'Я думаю о _____ .',
		english: 'I am thinking about _____.',
		requiredCase: 'prepositional',
		difficulty: 'common',
		explanation: 'After the preposition "о" (about), we use the prepositional case.'
	},
	{
		russian: 'Книга лежит на _____ .',
		english: 'The book is lying on _____.',
		requiredCase: 'prepositional',
		difficulty: 'common',
		explanation: 'After the preposition "на" (on) for location, we use the prepositional case.'
	},
	{
		russian: 'Я живу в _____ .',
		english: 'I live in _____.',
		requiredCase: 'prepositional',
		difficulty: 'common',
		explanation: 'After the preposition "в" (in) for location, we use the prepositional case.'
	},
	{
		russian: 'Мы говорим о _____ .',
		english: 'We are talking about _____.',
		requiredCase: 'prepositional',
		difficulty: 'common',
		explanation: 'After the preposition "о" (about), we use the prepositional case.'
	},
	{
		russian: 'Я читаю книгу о _____ .',
		english: 'I am reading a book about _____.',
		requiredCase: 'prepositional',
		difficulty: 'intermediate',
		explanation: 'After the preposition "о" (about), we use the prepositional case.'
	}
];

/**
 * Get templates by difficulty level
 * @param {string} difficulty - 'common', 'intermediate', or 'advanced'
 * @returns {Array} Filtered templates
 */
export function getTemplatesByDifficulty(difficulty) {
	if (difficulty === 'advanced') {
		return sentenceTemplates; // Include all
	}
	
	const levels = ['common', 'intermediate', 'advanced'];
	const targetIndex = levels.indexOf(difficulty);
	
	return sentenceTemplates.filter(template => {
		const templateIndex = levels.indexOf(template.difficulty);
		return templateIndex <= targetIndex;
	});
}

/**
 * Get templates by required case
 * @param {string} caseType - The grammatical case
 * @param {string} difficulty - Optional difficulty filter
 * @returns {Array} Filtered templates
 */
export function getTemplatesByCase(caseType, difficulty = 'advanced') {
	const templates = getTemplatesByDifficulty(difficulty);
	return templates.filter(template => template.requiredCase === caseType);
}

/**
 * Get a random template
 * @param {string} difficulty - Optional difficulty filter
 * @returns {Object} Random template
 */
export function getRandomTemplate(difficulty = 'advanced') {
	const templates = getTemplatesByDifficulty(difficulty);
	return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Get templates for easy difficulty (only accusative, genitive, and prepositional)
 * @returns {Array} Easy templates
 */
export function getEasyTemplates() {
	const easyCases = ['accusative', 'genitive', 'prepositional'];
	return sentenceTemplates.filter(template => 
		template.difficulty === 'common' && easyCases.includes(template.requiredCase)
	);
}

/**
 * All Russian grammatical cases
 */
export const russianCases = [
	'nominative',
	'genitive',
	'dative',
	'accusative',
	'instrumental',
	'prepositional'
];
