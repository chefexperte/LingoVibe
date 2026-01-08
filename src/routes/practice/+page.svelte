<script>
	import { onMount } from 'svelte';
	import DifficultySelector from '$lib/components/DifficultySelector.svelte';
	import QuizSettings from '$lib/components/QuizSettings.svelte';
	import QuizContainer from '$lib/components/QuizContainer.svelte';
	import { user, updatePreferences } from '$lib/stores/userStore.js';
	import { startQuiz, getStatsByCase, getOverallStats, quizHistory } from '$lib/stores/quizStore.js';

	let selectedDifficulty = 'common';
	let quizActive = false;
	let quizSettings = {
		quizType: 'all',
		questionCount: 10,
		selectedCases: ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional']
	};
	let showStats = false;
	let stats = null;
	let overallStats = null;

	onMount(() => {
		// Load saved difficulty preference
		if ($user?.preferences?.difficulty) {
			selectedDifficulty = $user.preferences.difficulty;
		}
		
		// Load stats
		loadStats();
	});

	function handleDifficultyChange(difficulty) {
		selectedDifficulty = difficulty;
		// Save preference if user is logged in
		if ($user) {
			updatePreferences({ difficulty });
		}
	}

	function handleStartQuiz(settings) {
		// Map word difficulty (common/intermediate/advanced) to quiz difficulty (easy/medium/hard)
		const difficultyMap = {
			'common': 'easy',
			'intermediate': 'medium',
			'advanced': 'hard'
		};
		
		// Merge top-level difficulty with quiz settings
		const fullSettings = {
			...settings,
			difficulty: difficultyMap[selectedDifficulty] || 'medium'
		};
		
		quizSettings = fullSettings;
		startQuiz(fullSettings);
		quizActive = true;
		showStats = false;
	}

	function handleQuizComplete(results) {
		console.log('Quiz completed:', results);
		// Quiz will automatically end and show results
		// After viewing results, user can start a new quiz
		loadStats();
	}

	function handleBackToMenu() {
		quizActive = false;
		showStats = false;
		loadStats();
	}

	function toggleStats() {
		showStats = !showStats;
		if (showStats) {
			loadStats();
		}
	}

	function loadStats() {
		stats = getStatsByCase($quizHistory);
		overallStats = getOverallStats($quizHistory);
	}

	const quizTypes = [
		{ id: 1, title: 'Vocabulary Quiz', icon: '📚', color: 'green', description: 'Test your word knowledge' },
		{ id: 2, title: 'Grammar Challenge', icon: '✏️', color: 'blue', description: 'Master grammar rules', available: true },
		{ id: 3, title: 'Listening Practice', icon: '🎧', color: 'yellow', description: 'Improve comprehension' },
		{ id: 4, title: 'Speaking Exercise', icon: '🗣️', color: 'red', description: 'Practice pronunciation' }
	];
</script>

<svelte:head>
	<title>Practice - LingoVibe</title>
</svelte:head>

<div class="container">
	{#if !quizActive}
		<h2>Practice & Quizzes</h2>
		
		<div class="card" style="margin-bottom: 30px;">
			<h3 style="margin-bottom: 8px;">Word Difficulty</h3>
			<p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;">(affects how common the words are)</p>
			<DifficultySelector selected={selectedDifficulty} onChange={handleDifficultyChange} />
		</div>

		<!-- Grammar Quiz Section -->
		<div class="card grammar-quiz-section" style="margin-bottom: 30px;">
			<div class="section-header">
				<h3>✏️ Grammar Challenge</h3>
				<p>Practice Russian noun declensions with dynamic quizzes powered by Wiktionary</p>
			</div>
			
			<QuizSettings 
				bind:settings={quizSettings}
				onStart={handleStartQuiz}
			/>
		</div>

		<!-- Quiz Statistics -->
		{#if overallStats && overallStats.totalQuizzes > 0}
			<div class="card stats-section" style="margin-bottom: 30px;">
				<div class="stats-header">
					<h3>📊 Your Statistics</h3>
					<button class="btn-text" on:click={toggleStats}>
						{showStats ? 'Hide' : 'Show'} Details
					</button>
				</div>

				<div class="overall-stats">
					<div class="stat-box">
						<div class="stat-value">{overallStats.totalQuizzes}</div>
						<div class="stat-label">Quizzes Taken</div>
					</div>
					<div class="stat-box">
						<div class="stat-value">{overallStats.totalCorrect}/{overallStats.totalQuestions}</div>
						<div class="stat-label">Correct Answers</div>
					</div>
					<div class="stat-box">
						<div class="stat-value">{overallStats.overallAccuracy}%</div>
						<div class="stat-label">Overall Accuracy</div>
					</div>
				</div>

				{#if showStats && stats}
					<div class="case-stats">
						<h4>Performance by Case</h4>
						<div class="case-stats-grid">
							{#each Object.entries(stats) as [caseName, stat]}
								{#if stat.total > 0}
									<div class="case-stat-item">
										<div class="case-name">{caseName.charAt(0).toUpperCase() + caseName.slice(1)}</div>
										<div class="case-progress">
											<div class="case-progress-bar">
												<div 
													class="case-progress-fill" 
													style="width: {stat.accuracy}%"
												></div>
											</div>
											<div class="case-accuracy">{stat.accuracy}%</div>
										</div>
										<div class="case-count">{stat.correct}/{stat.total}</div>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}
		
		<!-- Other Quiz Types (Coming Soon) -->
		<h3 style="margin-top: 40px; margin-bottom: 20px;">Coming Soon</h3>
		<div class="grid grid-2">
			{#each quizTypes.filter(q => !q.available) as quiz}
				<div class="card quiz-card {quiz.color}" style="opacity: 0.6; cursor: not-allowed;">
					<div class="quiz-icon">{quiz.icon}</div>
					<div class="quiz-title">{quiz.title}</div>
					<p style="color: var(--text-secondary);">{quiz.description}</p>
					<div class="quiz-difficulty-badge">
						Coming Soon
					</div>
				</div>
			{/each}
		</div>

		<div class="info-box">
			<p><strong>Note:</strong> Quiz difficulty filtering is based on word commonness. Common words are more frequently used in everyday Russian, while advanced words are less common but still useful.</p>
		</div>
	{:else}
		<!-- Active Quiz -->
		<div class="quiz-active-header">
			<button class="btn btn-secondary" on:click={handleBackToMenu}>
				← Back to Menu
			</button>
			<h2>Grammar Challenge</h2>
		</div>

		<QuizContainer onComplete={handleQuizComplete} />
	{/if}
</div>

<style>
	.quiz-difficulty-badge {
		margin-top: 12px;
		padding: 6px 12px;
		background: var(--bg-color);
		border-radius: 6px;
		font-size: 14px;
		color: var(--text-secondary);
		text-transform: capitalize;
	}

	.info-box {
		margin-top: 30px;
		padding: 20px;
		background: #e8f7ff;
		border-left: 4px solid var(--secondary-color);
		border-radius: 8px;
	}

	.info-box p {
		margin: 0;
		font-size: 14px;
		color: var(--text-color);
	}

	.grammar-quiz-section {
		border: 2px solid var(--secondary-color);
	}

	.section-header {
		margin-bottom: 25px;
	}

	.section-header h3 {
		font-size: 24px;
		margin-bottom: 8px;
		color: var(--text-color);
	}

	.section-header p {
		color: var(--text-secondary);
		font-size: 15px;
		margin: 0;
	}

	.quiz-active-header {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-bottom: 30px;
	}

	.quiz-active-header h2 {
		margin: 0;
	}

	.stats-section {
		background: linear-gradient(135deg, #f0ffe0 0%, #e8f7ff 100%);
	}

	.stats-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.stats-header h3 {
		margin: 0;
		font-size: 22px;
	}

	.btn-text {
		background: none;
		border: none;
		color: var(--secondary-color);
		font-weight: 600;
		cursor: pointer;
		padding: 8px 12px;
		border-radius: 6px;
		transition: background 0.2s;
	}

	.btn-text:hover {
		background: rgba(28, 176, 246, 0.1);
	}

	.overall-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15px;
		margin-bottom: 25px;
	}

	.stat-box {
		background: white;
		padding: 20px;
		border-radius: 8px;
		text-align: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.stat-value {
		font-size: 28px;
		font-weight: bold;
		color: var(--primary-color);
		margin-bottom: 5px;
	}

	.stat-label {
		font-size: 13px;
		color: var(--text-secondary);
	}

	.case-stats {
		margin-top: 25px;
		padding-top: 25px;
		border-top: 2px solid rgba(255, 255, 255, 0.5);
	}

	.case-stats h4 {
		margin-bottom: 15px;
		font-size: 18px;
		color: var(--text-color);
	}

	.case-stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	.case-stat-item {
		background: white;
		padding: 12px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.case-name {
		flex-shrink: 0;
		width: 100px;
		font-weight: 600;
		font-size: 14px;
		color: var(--text-color);
		text-transform: capitalize;
	}

	.case-progress {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.case-progress-bar {
		flex: 1;
		height: 8px;
		background: var(--border-color);
		border-radius: 4px;
		overflow: hidden;
	}

	.case-progress-fill {
		height: 100%;
		background: var(--primary-color);
		transition: width 0.3s ease;
	}

	.case-accuracy {
		flex-shrink: 0;
		width: 45px;
		font-size: 13px;
		font-weight: 600;
		color: var(--text-color);
		text-align: right;
	}

	.case-count {
		flex-shrink: 0;
		width: 50px;
		font-size: 12px;
		color: var(--text-secondary);
		text-align: right;
	}

	@media (max-width: 768px) {
		.overall-stats {
			grid-template-columns: 1fr;
		}

		.case-stats-grid {
			grid-template-columns: 1fr;
		}

		.quiz-active-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.section-header h3 {
			font-size: 20px;
		}

		.case-name {
			width: 85px;
			font-size: 13px;
		}

		.case-stat-item {
			padding: 10px;
		}
	}
</style>
