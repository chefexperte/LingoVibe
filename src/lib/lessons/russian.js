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
						{ word: 'стол', example: 'Стол большой.' },
						{ word: 'книга', example: 'Книга интересная.' },
						{ word: 'окно', example: 'Окно открыто.' },
						{ word: 'студент', example: 'Студент учится.' },
						{ word: 'вода', example: 'Вода холодная.' }
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
