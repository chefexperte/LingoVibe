/**
 * Application-wide constants
 */

// XP Rewards
export const XP_REWARDS = {
	LESSON_COMPLETE: 50,
	QUIZ_COMPLETE: 30,
	PERFECT_QUIZ: 50,
	DAILY_GOAL: 100
};

// Language Data
export const LANGUAGES = [
	{ code: 'ru', name: 'Russian', flag: '🇷🇺', status: 'available', description: 'Full course available' },
	{ code: 'spanish', name: 'Spanish', flag: '🇪🇸', status: 'coming-soon', description: 'Coming Soon' },
	{ code: 'french', name: 'French', flag: '🇫🇷', status: 'coming-soon', description: 'Coming Soon' },
	{ code: 'german', name: 'German', flag: '🇩🇪', status: 'coming-soon', description: 'Coming Soon' },
	{ code: 'italian', name: 'Italian', flag: '🇮🇹', status: 'coming-soon', description: 'Coming Soon' },
	{ code: 'japanese', name: 'Japanese', flag: '🇯🇵', status: 'coming-soon', description: 'Coming Soon' },
	{ code: 'korean', name: 'Korean', flag: '🇰🇷', status: 'coming-soon', description: 'Coming Soon' }
];

// Russian Cases
export const RUSSIAN_CASES = [
	'nominative',
	'genitive',
	'dative',
	'accusative',
	'instrumental',
	'prepositional'
];

// Quiz Settings
export const QUIZ_TYPES = {
	ALL: 'all',
	CASE_IDENTIFICATION: 'case-identification',
	CASE_FORMATION: 'case-formation',
	SENTENCE_COMPLETION: 'sentence-completion'
};

export const DIFFICULTY_LEVELS = {
	COMMON: 'common',
	INTERMEDIATE: 'intermediate',
	ADVANCED: 'advanced'
};

export const QUESTION_COUNTS = [5, 10, 15, 20];

// LocalStorage Keys
export const STORAGE_KEYS = {
	USER: 'lingovibeUser',
	LESSON_PROGRESS: 'lessonProgress',
	TOTAL_XP: 'totalXP',
	STREAK: 'streak',
	LAST_ACTIVE_DATE: 'lastActiveDate',
	WELCOME_SCREEN_SEEN: 'welcomeScreenSeen',
	QUIZ_HISTORY: 'quizHistory'
};
