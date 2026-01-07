<script>
	import { base } from '$app/paths';

	const stats = [
		{ icon: '🔥', value: '7', label: 'Day Streak' },
		{ icon: '⭐', value: '450', label: 'Total XP' },
		{ icon: '🏆', value: '12', label: 'Achievements' }
	];

	const languages = [
		{ code: 'spanish', name: 'Spanish', flag: '🇪🇸', progress: 15, level: 'Beginner' },
		{ code: 'french', name: 'French', flag: '🇫🇷', progress: 0, level: 'Not Started' },
		{ code: 'german', name: 'German', flag: '🇩🇪', progress: 0, level: 'Not Started' },
		{ code: 'italian', name: 'Italian', flag: '🇮🇹', progress: 0, level: 'Not Started' },
		{ code: 'japanese', name: 'Japanese', flag: '🇯🇵', progress: 0, level: 'Not Started' },
		{ code: 'korean', name: 'Korean', flag: '🇰🇷', progress: 0, level: 'Not Started' }
	];
</script>

<svelte:head>
	<title>My Learning - LingoVibe</title>
</svelte:head>

<div class="container">
	<h2>My Learning Dashboard</h2>

	<div class="stats-grid">
		{#each stats as stat}
			<div class="stat-card">
				<div class="icon">{stat.icon}</div>
				<div class="value">{stat.value}</div>
				<div class="label">{stat.label}</div>
			</div>
		{/each}
	</div>

	<h2>My Languages</h2>
	<div class="grid grid-2">
		{#each languages as lang}
			<a href="{base}/learn/{lang.code}" class="card card-clickable">
				<div class="language-card">
					<div class="language-flag">{lang.flag}</div>
					<div class="language-info">
						<div class="language-name">{lang.name}</div>
						<span class="badge {lang.progress > 0 ? 'badge-success' : 'badge-gray'}">
							{lang.level}
						</span>
						<div class="progress-bar">
							<div class="progress-fill" style="width: {lang.progress}%">
								{#if lang.progress > 0}
									{lang.progress}%
								{/if}
							</div>
						</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
