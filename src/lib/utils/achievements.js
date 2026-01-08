/**
 * Achievement definitions
 */

export const ACHIEVEMENTS = [
	{
		id: 'first_steps',
		name: 'First Steps',
		description: 'Complete your first lesson',
		icon: '👶',
		xpBonus: 10,
		condition: (stats) => stats.lessonsCompleted >= 1,
		tier: 'bronze'
	},
	{
		id: 'quiz_master',
		name: 'Quiz Master',
		description: 'Get 100% on a quiz',
		icon: '🎯',
		xpBonus: 25,
		condition: (stats) => stats.perfectQuizzes >= 1,
		tier: 'silver'
	},
	{
		id: 'week_warrior',
		name: 'Week Warrior',
		description: 'Maintain a 7-day streak',
		icon: '🔥',
		xpBonus: 50,
		condition: (stats) => stats.streak >= 7,
		tier: 'gold'
	},
	{
		id: 'dedicated_learner',
		name: 'Dedicated Learner',
		description: 'Complete 10 lessons',
		icon: '📚',
		xpBonus: 100,
		condition: (stats) => stats.lessonsCompleted >= 10,
		tier: 'gold'
	},
	{
		id: 'xp_hunter',
		name: 'XP Hunter',
		description: 'Earn 500 total XP',
		icon: '⭐',
		xpBonus: 50,
		condition: (stats) => stats.totalXP >= 500,
		tier: 'silver'
	},
	{
		id: 'practice_perfect',
		name: 'Practice Makes Perfect',
		description: 'Complete 20 quizzes',
		icon: '💪',
		xpBonus: 75,
		condition: (stats) => stats.quizzesCompleted >= 20,
		tier: 'gold'
	},
	{
		id: 'streak_master',
		name: 'Streak Master',
		description: 'Maintain a 30-day streak',
		icon: '🔥',
		xpBonus: 200,
		condition: (stats) => stats.streak >= 30,
		tier: 'platinum'
	},
	{
		id: 'century_club',
		name: 'Century Club',
		description: 'Earn 1000 total XP',
		icon: '💯',
		xpBonus: 100,
		condition: (stats) => stats.totalXP >= 1000,
		tier: 'platinum'
	}
];

export const ACHIEVEMENT_TIERS = {
	bronze: { color: '#CD7F32', label: 'Bronze' },
	silver: { color: '#C0C0C0', label: 'Silver' },
	gold: { color: '#FFD700', label: 'Gold' },
	platinum: { color: '#E5E4E2', label: 'Platinum' }
};
