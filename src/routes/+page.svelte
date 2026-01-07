<script>
	import { base } from '$app/paths';

	const languages = [
		{ code: 'spanish', name: 'Spanish', flag: '🇪🇸', learners: '23.5M' },
		{ code: 'french', name: 'French', flag: '🇫🇷', learners: '15.2M' },
		{ code: 'german', name: 'German', flag: '🇩🇪', learners: '12.8M' },
		{ code: 'italian', name: 'Italian', flag: '🇮🇹', learners: '8.9M' },
		{ code: 'japanese', name: 'Japanese', flag: '🇯🇵', learners: '18.4M' },
		{ code: 'korean', name: 'Korean', flag: '🇰🇷', learners: '10.3M' }
	];

	const features = [
		{ icon: '🎮', title: 'Gamified Learning', description: 'Earn XP, unlock achievements, and track your progress' },
		{ icon: '📖', title: 'Wiktionary Powered', description: 'Access comprehensive language data from Wiktionary' },
		{ icon: '❓', title: 'Interactive Quizzes', description: 'Test your knowledge with engaging quizzes' },
		{ icon: '📊', title: 'Progress Tracking', description: 'Monitor your learning journey with detailed statistics' }
	];
</script>

<svelte:head>
	<title>LingoVibe - Learn Languages with Joy</title>
</svelte:head>

<div class="container">
	<div class="hero">
		<h1>Learn Languages with Joy</h1>
		<p>Master new languages through gamified lessons and interactive practice</p>
	</div>

	<div class="features-grid">
		{#each features as feature}
			<div class="feature-item">
				<div class="feature-icon">{feature.icon}</div>
				<h3>{feature.title}</h3>
				<p>{feature.description}</p>
			</div>
		{/each}
	</div>

	<h2>Choose Your Language</h2>
	<div class="grid grid-3">
		{#each languages as lang}
			<a href="{base}/learn/{lang.code}" class="card card-clickable">
				<div class="language-card">
					<div class="language-flag">{lang.flag}</div>
					<div class="language-info">
						<div class="language-name">{lang.name}</div>
						<div class="language-learners">{lang.learners} learners</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
