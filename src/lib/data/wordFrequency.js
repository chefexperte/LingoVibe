/**
 * Russian word frequency/commonness data
 * Based on word frequency in modern Russian
 */

/**
 * Word commonness levels:
 * - common: Most frequently used words (top 1000)
 * - intermediate: Moderately common words (1000-5000)
 * - advanced: Less common but useful words (5000+)
 */

export const wordFrequency = {
	// Common words - essential vocabulary
	'и': 'common',
	'в': 'common',
	'не': 'common',
	'на': 'common',
	'я': 'common',
	'что': 'common',
	'он': 'common',
	'с': 'common',
	'как': 'common',
	'это': 'common',
	'быть': 'common',
	'вы': 'common',
	'а': 'common',
	'мы': 'common',
	'к': 'common',
	'но': 'common',
	'они': 'common',
	'по': 'common',
	'за': 'common',
	'у': 'common',
	'то': 'common',
	'из': 'common',
	'о': 'common',
	'так': 'common',
	'же': 'common',
	'все': 'common',
	'для': 'common',
	'или': 'common',
	'от': 'common',
	'при': 'common',
	
	// Lesson 1 words
	'стол': 'common',
	'книга': 'common',
	'окно': 'common',
	'студент': 'common',
	'вода': 'common',
	'дом': 'common',
	'человек': 'common',
	'день': 'common',
	'год': 'common',
	'рука': 'common',
	'работа': 'common',
	'место': 'common',
	'время': 'common',
	'жизнь': 'common',
	'слово': 'common',
	'дело': 'common',
	'друг': 'common',
	'мать': 'common',
	'отец': 'common',
	'город': 'common',
	'глаз': 'common',
	'голова': 'common',
	
	// Intermediate words
	'учитель': 'intermediate',
	'школа': 'intermediate',
	'университет': 'intermediate',
	'занятие': 'intermediate',
	'урок': 'intermediate',
	'экзамен': 'intermediate',
	'тетрадь': 'intermediate',
	'ручка': 'intermediate',
	'карандаш': 'intermediate',
	'доска': 'intermediate',
	'страница': 'intermediate',
	'текст': 'intermediate',
	'задание': 'intermediate',
	'ответ': 'intermediate',
	'вопрос': 'intermediate',
	'словарь': 'intermediate',
	'перевод': 'intermediate',
	'грамматика': 'intermediate',
	'произношение': 'intermediate',
	'акцент': 'intermediate',
	
	// Advanced words
	'достопримечательность': 'advanced',
	'препятствие': 'advanced',
	'благополучие': 'advanced',
	'обстоятельство': 'advanced',
	'преимущество': 'advanced',
	'недостаток': 'advanced',
	'зависимость': 'advanced',
	'независимость': 'advanced',
	'совершенство': 'advanced',
	'несовершенство': 'advanced',
	'возможность': 'advanced',
	'невозможность': 'advanced',
	'действительность': 'advanced',
	'необходимость': 'advanced',
	'закономерность': 'advanced'
};

/**
 * Get the commonness level of a word
 * @param {string} word - The Russian word
 * @returns {string} Commonness level: 'common', 'intermediate', or 'advanced'
 */
export function getWordCommonness(word) {
	return wordFrequency[word] || 'intermediate';
}

/**
 * Check if a word matches the difficulty level
 * @param {string} word - The Russian word
 * @param {string} difficulty - Target difficulty: 'common', 'intermediate', or 'advanced'
 * @returns {boolean} True if word matches or is easier than difficulty
 */
export function matchesDifficulty(word, difficulty) {
	const levels = ['common', 'intermediate', 'advanced'];
	const wordLevel = getWordCommonness(word);
	const targetLevel = levels.indexOf(difficulty);
	const currentLevel = levels.indexOf(wordLevel);
	
	// Include words at or below the target difficulty
	return currentLevel <= targetLevel;
}

/**
 * Filter words by difficulty level
 * @param {Array<string>} words - Array of Russian words
 * @param {string} difficulty - Target difficulty level
 * @returns {Array<string>} Filtered words
 */
export function filterWordsByDifficulty(words, difficulty) {
	if (difficulty === 'advanced') {
		// Advanced includes all words
		return words;
	}
	
	return words.filter(word => matchesDifficulty(word, difficulty));
}

/**
 * Get all words at a specific difficulty level
 * @param {string} difficulty - Target difficulty level
 * @returns {Array<string>} Words at that difficulty
 */
export function getWordsByLevel(difficulty) {
	return Object.keys(wordFrequency).filter(word => wordFrequency[word] === difficulty);
}
