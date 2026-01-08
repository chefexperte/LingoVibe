/**
 * Russian language lesson data
 */

export const russianLessons = [
	{
		id: 1,
		title: 'Russian Basics: Cases Introduction',
		type: 'grammar',
		status: 'available',
		icon: '📚',
		xpReward: 15,
		sections: [
			{
				id: 'intro',
				title: 'Introduction to Russian Cases',
				type: 'text',
				content: {
					heading: 'What are Grammatical Cases?',
					text: `In Russian, nouns, pronouns, and adjectives change their form depending on their role in a sentence. These different forms are called "cases."

Russian has 6 grammatical cases:
• **Nominative** (именительный) - Subject of the sentence
• **Accusative** (винительный) - Direct object
• **Genitive** (родительный) - Possession, "of" something
• **Dative** (дательный) - Indirect object, "to/for" someone
• **Instrumental** (творительный) - "with/by" something
• **Prepositional** (предложный) - Location, "about" something

Today, we'll focus on the **Nominative case** - the foundation of Russian grammar!`
				}
			},
			{
				id: 'nominative-explanation',
				title: 'The Nominative Case',
				type: 'text',
				content: {
					heading: 'What is the Nominative Case?',
					text: `The **nominative case** (именительный падеж) is used for:
• The **subject** of a sentence - the person or thing doing the action
• The **predicate nominative** - after "to be" verbs

**English Example:**
"The **book** is on the table."
("book" is the subject, so it's in nominative case)

**Russian Example:**
"**Книга** на столе."
("Книга" (book) is the subject, in nominative case)

The nominative case is the "dictionary form" - it's how words appear in dictionaries and how you first learn them. It's the simplest case because it doesn't require any changes!`
				}
			},
			{
				id: 'word-examples',
				title: 'Word Examples',
				type: 'words',
				content: {
					heading: 'Common Russian Nouns in Nominative Case',
					text: 'Here are some essential Russian words. Pay attention to their nominative forms:',
					words: [
						{ word: 'стол', example: 'Стол большой.', commonness: 'common' },
						{ word: 'книга', example: 'Книга интересная.', commonness: 'common' },
						{ word: 'окно', example: 'Окно открыто.', commonness: 'common' },
						{ word: 'студент', example: 'Студент учится.', commonness: 'common' },
						{ word: 'вода', example: 'Вода холодная.', commonness: 'common' }
					]
				}
			},
			{
				id: 'practice',
				title: 'Practice Exercise',
				type: 'quiz',
				content: {
					heading: 'Identify the Nominative Case',
					text: 'Test your understanding! Select the word in nominative case:',
					questions: [
						{
							id: 'q1',
							question: 'In the sentence "Студент читает книгу" (The student reads a book), which word is in nominative case?',
							options: [
								{ text: 'Студент', correct: true, explanation: 'Correct! "Студент" is the subject doing the action, so it\'s in nominative case.' },
								{ text: 'читает', correct: false, explanation: 'This is a verb (reads), not a noun in nominative case.' },
								{ text: 'книгу', correct: false, explanation: 'This is the object (book in accusative case), not the subject.' }
							]
						},
						{
							id: 'q2',
							question: 'Which sentence uses "книга" (book) in the nominative case?',
							options: [
								{ text: 'Я читаю книгу', correct: false, explanation: 'Here "книгу" is the object (accusative case), not the subject.' },
								{ text: 'Книга на столе', correct: true, explanation: 'Correct! "Книга" is the subject here, in nominative case.' },
								{ text: 'У меня нет книги', correct: false, explanation: 'Here "книги" is in genitive case (expressing possession/absence).' }
							]
						},
						{
							id: 'q3',
							question: 'What is the nominative form of the word "table" in Russian?',
							options: [
								{ text: 'стола', correct: false, explanation: 'This is genitive case.' },
								{ text: 'столом', correct: false, explanation: 'This is instrumental case.' },
								{ text: 'стол', correct: true, explanation: 'Correct! "Стол" is the nominative (dictionary) form.' }
							]
						},
						{
							id: 'q4',
							question: 'In "Вода холодная" (The water is cold), what case is "вода"?',
							options: [
								{ text: 'Accusative', correct: false, explanation: 'Accusative is for direct objects, not subjects.' },
								{ text: 'Nominative', correct: true, explanation: 'Correct! "Вода" is the subject, so it\'s in nominative case.' },
								{ text: 'Genitive', correct: false, explanation: 'Genitive expresses possession or "of", not applicable here.' }
							]
						}
					]
				}
			},
			{
				id: 'summary',
				title: 'Summary & Completion',
				type: 'summary',
				content: {
					heading: 'Great Work! 🎉',
					keyTakeaways: [
						'Russian has 6 grammatical cases that change word endings',
						'The nominative case is used for the subject of a sentence',
						'Nominative is the "dictionary form" - the base form of words',
						'You learned 5 important Russian nouns: стол, книга, окно, студент, вода',
						'Identifying the subject helps you find the nominative case'
					],
					nextLesson: {
						id: 2,
						title: 'The Accusative Case',
						preview: 'Learn how Russian nouns change when they become direct objects!'
					}
				}
			}
		]
	},
	{
		id: 2,
		title: 'The Accusative Case',
		type: 'grammar',
		status: 'available',
		icon: '🎯',
		xpReward: 20,
		sections: [
			{
				id: 'intro',
				type: 'text',
				content: {
					heading: 'Understanding the Accusative Case',
					text: `The **accusative case** (винительный падеж) is used for:
• The **direct object** of a sentence - what/whom the action affects
• After certain prepositions of motion (в, на, за, etc.)

**English Example:**
"I see the **book**."
("book" is the direct object, receives the action)

**Russian Example:**
"Я вижу **книгу**."
("книгу" is accusative form of "книга")

**Key Rule**: For feminine nouns ending in -а or -я, change to -у or -ю. For masculine inanimate nouns, accusative = nominative. For masculine animate nouns, accusative = genitive.`
				}
			},
			{
				id: 'word-examples',
				type: 'words',
				content: {
					heading: 'Accusative Case Examples',
					text: 'Practice these common words in accusative case:',
					words: [
						{ word: 'книга', example: 'Я читаю книгу.', commonness: 'common' },
						{ word: 'вода', example: 'Я пью воду.', commonness: 'common' },
						{ word: 'стол', example: 'Я вижу стол.', commonness: 'common' },
						{ word: 'брат', example: 'Я знаю брата.', commonness: 'common' },
						{ word: 'город', example: 'Я люблю город.', commonness: 'common' }
					]
				}
			},
			{
				id: 'practice',
				type: 'quiz',
				content: {
					heading: 'Practice: Accusative Case',
					text: 'Choose the correct accusative form:',
					questions: [
						{
							id: 'q1',
							question: 'Я вижу ___ (книга)',
							options: [
								{ text: 'книга', correct: false, explanation: 'This is nominative case.' },
								{ text: 'книгу', correct: true, explanation: 'Correct! Feminine -а changes to -у in accusative.' },
								{ text: 'книге', correct: false, explanation: 'This is prepositional/dative case.' },
								{ text: 'книги', correct: false, explanation: 'This is genitive case.' }
							]
						},
						{
							id: 'q2',
							question: 'Он любит ___ (город)',
							options: [
								{ text: 'город', correct: true, explanation: 'Correct! Masculine inanimate nouns stay the same in accusative.' },
								{ text: 'города', correct: false, explanation: 'This is genitive case.' },
								{ text: 'городу', correct: false, explanation: 'This is dative case.' },
								{ text: 'городе', correct: false, explanation: 'This is prepositional case.' }
							]
						},
						{
							id: 'q3',
							question: 'Мы знаем ___ (студент)',
							options: [
								{ text: 'студент', correct: false, explanation: 'For animate masculine nouns, accusative = genitive.' },
								{ text: 'студента', correct: true, explanation: 'Correct! Masculine animate nouns use genitive form in accusative.' },
								{ text: 'студенту', correct: false, explanation: 'This is dative case.' },
								{ text: 'студенте', correct: false, explanation: 'This is prepositional case.' }
							]
						}
					]
				}
			},
			{
				id: 'summary',
				type: 'summary',
				content: {
					heading: 'Great Job!',
					keyTakeaways: [
						'Accusative case marks direct objects',
						'Feminine -а/-я changes to -у/-ю',
						'Masculine inanimate = nominative',
						'Masculine animate = genitive form'
					]
				}
			}
		]
	},
	{
		id: 3,
		title: 'The Genitive Case',
		type: 'grammar',
		status: 'available',
		icon: '🔗',
		xpReward: 25,
		sections: [
			{
				id: 'intro',
				type: 'text',
				content: {
					heading: 'The Genitive Case',
					text: `The **genitive case** (родительный падеж) is one of the most versatile cases in Russian. It's used for:
• **Possession** - showing ownership ("of" in English)
• **Negation** - after "нет" (there is no...)
• **Quantity** - after numbers and quantity words
• **After certain prepositions** - от, до, из, без, у, для, etc.

**English Example:**
"The book **of the student**"
("student" shows possession)

**Russian Example:**
"Книга **студента**"
("студента" is genitive form of "студент")

**Common Pattern**: For masculine nouns, often add -а or -я. For feminine nouns ending in -а, change to -ы or -и. For neuter nouns ending in -о, change to -а.`
				}
			},
			{
				id: 'word-examples',
				type: 'words',
				content: {
					heading: 'Genitive Case in Action',
					text: 'Learn these common genitive forms:',
					words: [
						{ word: 'стол', example: 'нет стола (no table)', commonness: 'common' },
						{ word: 'книга', example: 'нет книги (no book)', commonness: 'common' },
						{ word: 'окно', example: 'нет окна (no window)', commonness: 'common' },
						{ word: 'студент', example: 'книга студента (student\'s book)', commonness: 'common' },
						{ word: 'вода', example: 'стакан воды (glass of water)', commonness: 'common' }
					]
				}
			},
			{
				id: 'practice',
				type: 'quiz',
				content: {
					heading: 'Practice: Genitive Case',
					text: 'Fill in the genitive form:',
					questions: [
						{
							id: 'q1',
							question: 'Нет ___ (стол)',
							options: [
								{ text: 'стол', correct: false, explanation: 'This is nominative case.' },
								{ text: 'стола', correct: true, explanation: 'Correct! Masculine nouns add -а in genitive.' },
								{ text: 'столу', correct: false, explanation: 'This is dative case.' },
								{ text: 'столе', correct: false, explanation: 'This is prepositional case.' }
							]
						},
						{
							id: 'q2',
							question: 'Книга ___ (студент)',
							options: [
								{ text: 'студент', correct: false, explanation: 'This is nominative case.' },
								{ text: 'студента', correct: true, explanation: 'Correct! Genitive shows possession - "student\'s book".' },
								{ text: 'студенту', correct: false, explanation: 'This is dative case.' },
								{ text: 'студенте', correct: false, explanation: 'This is prepositional case.' }
							]
						},
						{
							id: 'q3',
							question: 'Стакан ___ (вода)',
							options: [
								{ text: 'вода', correct: false, explanation: 'This is nominative case.' },
								{ text: 'воду', correct: false, explanation: 'This is accusative case.' },
								{ text: 'воды', correct: true, explanation: 'Correct! Feminine -а changes to -ы in genitive.' },
								{ text: 'воде', correct: false, explanation: 'This is prepositional/dative case.' }
							]
						}
					]
				}
			},
			{
				id: 'summary',
				type: 'summary',
				content: {
					heading: 'Excellent Work!',
					keyTakeaways: [
						'Genitive shows possession and "of" relationships',
						'Used after negation with нет',
						'Used with quantities and numbers',
						'Masculine: add -а or -я',
						'Feminine -а: change to -ы or -и'
					]
				}
			}
		]
	}
];

/**
 * Get lesson by ID
 * @param {number} lessonId - The lesson ID
 * @returns {Object|null} Lesson data or null
 */
export function getLessonById(lessonId) {
	return russianLessons.find(lesson => lesson.id === lessonId) || null;
}

/**
 * Get all available lessons
 * @returns {Array<Object>} All lessons
 */
export function getAllLessons() {
	return russianLessons;
}
