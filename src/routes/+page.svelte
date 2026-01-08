<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { welcomeScreenSeen, user } from '$lib/stores/userStore.js';
	import { totalXP, lessonProgress, streak } from '$lib/stores/lessonStore.js';
	import { quizHistory } from '$lib/stores/quizStore.js';
	import { recentAchievements } from '$lib/stores/achievementStore.js';
	import { vocabularyStats, masteredWords } from '$lib/stores/vocabularyStore.js';
	import { getAllLessons } from '$lib/lessons/russian.js';
	import AchievementCard from '$lib/components/AchievementCard.svelte';

	// Check if user should see welcome screen
	onMount(() => {
		const unsubscribe = welcomeScreenSeen.subscribe(seen => {
			if (!seen) {
				goto(`${base}/welcome`);
			}
		});
		return unsubscribe;
	});

	// Calculate stats
	$: russianProgress = $lessonProgress['ru']?.length || 0;
	$: totalLessons = getAllLessons().length;
	$: hasActiveCourse = russianProgress > 0;
	$: progressPercent = totalLessons > 0 ? Math.round((russianProgress / totalLessons) * 100) : 0;

	// Weekly stats (last 7 days)
	$: weekQuizzes = $quizHistory.filter(quiz => {
		const quizDate = new Date(quiz.date);
		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);
		return quizDate >= weekAgo;
	}).length;

	$: weekXP = $quizHistory
		.filter(quiz => {
			const quizDate = new Date(quiz.date);
			const weekAgo = new Date();
			weekAgo.setDate(weekAgo.getDate() - 7);
			return quizDate >= weekAgo;
		})
		.reduce((sum, quiz) => sum + (quiz.score * 10), 0); // Rough estimate

	$: weekLessons = 0; // Could track this with more detailed history
</script>

<svelte:head>
	<title>LingoVibe - Learn Languages with Joy</title>
</svelte:head>

<div class="home-container">
	<!-- Welcome Section -->
	<div class="welcome-section">
		<h1>Welcome back, {$user?.username || 'Learner'}! 👋</h1>
		<p class="welcome-subtitle">Let's continue your learning journey</p>
	</div>

	<!-- Stats Cards (3 columns on desktop, stack on mobile) -->
	<div class="stats-grid">
		<div class="stat-card xp-card">
			<div class="stat-icon">⭐</div>
			<div class="stat-value">{$totalXP}</div>
			<div class="stat-label">Total XP</div>
		</div>
		<div class="stat-card streak-card">
			<div class="stat-icon">🔥</div>
			<div class="stat-value">{$streak}</div>
			<div class="stat-label">Day Streak</div>
			<div class="stat-hint">Keep it up!</div>
		</div>
		<div class="stat-card lessons-card">
			<div class="stat-icon">📚</div>
			<div class="stat-value">{russianProgress}</div>
			<div class="stat-label">Lessons Completed</div>
		</div>
		<div class="stat-card vocab-card">
			<div class="stat-icon">📖</div>
			<div class="stat-value">{$masteredWords.length}</div>
			<div class="stat-label">Words Mastered</div>
			<div class="stat-hint">{$vocabularyStats.total} total</div>
		</div>
	</div>

	<!-- Current Course Progress -->
	{#if hasActiveCourse}
		<div class="current-course-card">
			<h2>🇷🇺 Russian Course</h2>
			<div class="course-progress">
				<div class="progress-text">
					<span>{russianProgress} / {totalLessons} Lessons</span>
					<span>{progressPercent}%</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progressPercent}%"></div>
				</div>
			</div>
			<div class="course-actions">
				<a href="{base}/courses/ru" class="btn btn-primary">
					Continue Learning →
				</a>
				<a href="{base}/practice" class="btn btn-secondary">
					Practice Quiz
				</a>
			</div>
		</div>
	{:else}
		<div class="no-course-card">
			<h2>Start Your Learning Journey</h2>
			<p>Choose a course to begin learning a new language</p>
			<a href="{base}/courses" class="btn btn-primary">
				Browse Courses →
			</a>
		</div>
	{/if}

	<!-- Recent Achievements -->
	{#if $recentAchievements.length > 0}
		<div class="achievements-section">
			<div class="section-header">
				<h2>🏆 Recent Achievements</h2>
				<a href="{base}/achievements" class="view-all-link">View All →</a>
			</div>
			<div class="achievements-grid">
				{#each $recentAchievements.slice(0, 3) as achievement}
					<AchievementCard {achievement} compact={true} />
				{/each}
			</div>
		</div>
	{/if}

	<!-- Quick Stats / Activity Summary -->
	<div class="activity-summary">
		<h3>This Week</h3>
		<div class="week-stats">
			<div class="week-stat">
				<span class="stat-number">{weekXP}</span>
				<span class="stat-text">XP Earned</span>
			</div>
			<div class="week-stat">
				<span class="stat-number">{weekQuizzes}</span>
				<span class="stat-text">Quizzes Completed</span>
			</div>
			<div class="week-stat">
				<span class="stat-number">{weekLessons}</span>
				<span class="stat-text">Lessons Finished</span>
			</div>
		</div>
	</div>
</div>

<style>
	.home-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.welcome-section {
		text-align: center;
		margin-bottom: 30px;
	}

	.welcome-section h1 {
		font-size: 36px;
		margin-bottom: 10px;
		color: var(--text-color);
	}

	.welcome-subtitle {
		font-size: 18px;
		color: var(--text-secondary);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
		margin-bottom: 30px;
	}

	.stat-card {
		background: var(--card-bg);
		border-radius: var(--radius);
		padding: 25px;
		text-align: center;
		box-shadow: var(--shadow);
		transition: transform 0.2s;
	}

	.stat-card:hover {
		transform: translateY(-4px);
	}

	.stat-icon {
		font-size: 48px;
		margin-bottom: 10px;
	}

	.stat-value {
		font-size: 36px;
		font-weight: 700;
		color: var(--primary-color);
		margin-bottom: 5px;
	}

	.stat-label {
		font-size: 14px;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-hint {
		font-size: 12px;
		color: var(--text-secondary);
		margin-top: 5px;
		font-style: italic;
	}

	.current-course-card,
	.no-course-card {
		background: var(--card-bg);
		border-radius: var(--radius);
		padding: 30px;
		box-shadow: var(--shadow);
		margin-bottom: 30px;
	}

	.current-course-card h2,
	.no-course-card h2 {
		font-size: 28px;
		margin-bottom: 20px;
	}

	.course-progress {
		margin-bottom: 25px;
	}

	.progress-text {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
		font-size: 16px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.progress-bar {
		background: var(--bg-secondary);
		border-radius: 10px;
		height: 12px;
		overflow: hidden;
	}

	.progress-fill {
		background: var(--primary-gradient);
		height: 100%;
		border-radius: 10px;
		transition: width 0.3s ease;
	}

	.course-actions {
		display: flex;
		gap: 15px;
		flex-wrap: wrap;
	}

	.no-course-card {
		text-align: center;
	}

	.no-course-card p {
		color: var(--text-secondary);
		margin-bottom: 25px;
	}

	.achievements-section {
		margin-bottom: 30px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.section-header h2 {
		font-size: 24px;
	}

	.view-all-link {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 600;
		font-size: 14px;
	}

	.view-all-link:hover {
		text-decoration: underline;
	}

	.achievements-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 15px;
	}

	.activity-summary {
		background: var(--card-bg);
		border-radius: var(--radius);
		padding: 30px;
		box-shadow: var(--shadow);
	}

	.activity-summary h3 {
		font-size: 20px;
		margin-bottom: 20px;
		text-align: center;
	}

	.week-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 20px;
	}

	.week-stat {
		text-align: center;
		padding: 15px;
		background: var(--bg-secondary);
		border-radius: var(--radius);
	}

	.stat-number {
		display: block;
		font-size: 32px;
		font-weight: 700;
		color: var(--primary-color);
		margin-bottom: 8px;
	}

	.stat-text {
		display: block;
		font-size: 14px;
		color: var(--text-secondary);
	}

	@media (max-width: 768px) {
		.welcome-section h1 {
			font-size: 28px;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.course-actions {
			flex-direction: column;
		}

		.achievements-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
