<script>
	const quizTypes = [
		{ id: 1, title: 'Vocabulary Quiz', icon: '📚', color: 'green', description: 'Test your word knowledge' },
		{ id: 2, title: 'Grammar Challenge', icon: '✏️', color: 'blue', description: 'Master grammar rules' },
		{ id: 3, title: 'Listening Practice', icon: '🎧', color: 'yellow', description: 'Improve comprehension' },
		{ id: 4, title: 'Speaking Exercise', icon: '🗣️', color: 'red', description: 'Practice pronunciation' }
	];

	const recentActivity = [
		{ id: 1, quiz: 'Vocabulary Quiz', language: 'Spanish', icon: '📚', score: '85%', xp: '+20 XP', date: 'Today' },
		{ id: 2, quiz: 'Grammar Challenge', language: 'Spanish', icon: '✏️', score: '92%', xp: '+25 XP', date: 'Yesterday' },
		{ id: 3, quiz: 'Listening Practice', language: 'Spanish', icon: '🎧', score: '78%', xp: '+15 XP', date: '2 days ago' }
	];
</script>

<svelte:head>
	<title>Practice - LingoVibe</title>
</svelte:head>

<div class="container">
	<h2>Practice & Quizzes</h2>
	
	<div class="grid grid-2">
		{#each quizTypes as quiz}
			<div class="card quiz-card {quiz.color}">
				<div class="quiz-icon">{quiz.icon}</div>
				<div class="quiz-title">{quiz.title}</div>
				<p style="color: var(--text-secondary);">{quiz.description}</p>
			</div>
		{/each}
	</div>

	<h2 style="margin-top: 40px;">Recent Activity</h2>
	<div class="card">
		{#each recentActivity as activity}
			<div class="activity-item">
				<div class="activity-info">
					<div class="activity-icon">{activity.icon}</div>
					<div class="activity-details">
						<h4>{activity.quiz}</h4>
						<p>{activity.language} • {activity.date}</p>
					</div>
				</div>
				<div class="activity-score">
					<div class="score">{activity.score}</div>
					<div class="xp">{activity.xp}</div>
				</div>
			</div>
		{/each}
	</div>
</div>
