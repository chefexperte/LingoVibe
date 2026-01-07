<script>
	import DifficultySelector from '$lib/components/DifficultySelector.svelte';
	import { user, updatePreferences } from '$lib/stores/userStore.js';
	import { onMount } from 'svelte';

	let selectedDifficulty = 'common';

	onMount(() => {
		// Load saved difficulty preference
		if ($user?.preferences?.difficulty) {
			selectedDifficulty = $user.preferences.difficulty;
		}
	});

	function handleDifficultyChange(difficulty) {
		selectedDifficulty = difficulty;
		// Save preference if user is logged in
		if ($user) {
			updatePreferences({ difficulty });
		}
	}

	const quizTypes = [
		{ id: 1, title: 'Vocabulary Quiz', icon: '📚', color: 'green', description: 'Test your word knowledge' },
		{ id: 2, title: 'Grammar Challenge', icon: '✏️', color: 'blue', description: 'Master grammar rules' },
		{ id: 3, title: 'Listening Practice', icon: '🎧', color: 'yellow', description: 'Improve comprehension' },
		{ id: 4, title: 'Speaking Exercise', icon: '🗣️', color: 'red', description: 'Practice pronunciation' }
	];
</script>

<svelte:head>
	<title>Practice - LingoVibe</title>
</svelte:head>

<div class="container">
	<h2>Practice & Quizzes</h2>
	
	<div class="card" style="margin-bottom: 30px;">
		<DifficultySelector selected={selectedDifficulty} onChange={handleDifficultyChange} />
	</div>
	
	<div class="grid grid-2">
		{#each quizTypes as quiz}
			<div class="card quiz-card {quiz.color}">
				<div class="quiz-icon">{quiz.icon}</div>
				<div class="quiz-title">{quiz.title}</div>
				<p style="color: var(--text-secondary);">{quiz.description}</p>
				<div class="quiz-difficulty-badge">
					Difficulty: <strong>{selectedDifficulty}</strong>
				</div>
			</div>
		{/each}
	</div>

	<div class="info-box">
		<p><strong>Note:</strong> Quiz difficulty filtering is based on word commonness. Common words are more frequently used in everyday Russian, while advanced words are less common but still useful.</p>
	</div>
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
</style>
