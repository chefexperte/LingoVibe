<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { welcomeScreenSeen, user } from '$lib/stores/userStore.js';
	import { totalXP, lessonProgress, streak } from '$lib/stores/lessonStore.js';

	// Check if user should see welcome screen
	onMount(() => {
		const unsubscribe = welcomeScreenSeen.subscribe(seen => {
			if (!seen) {
				goto(`${base}/welcome`);
			}
		});
		return unsubscribe;
	});

	const languages = [
		{ code: 'ru', name: 'Russian', flag: '🇷🇺', status: 'available', description: 'Full course available' },
		{ code: 'spanish', name: 'Spanish', flag: '🇪🇸', status: 'coming-soon', description: 'Coming Soon' },
		{ code: 'french', name: 'French', flag: '🇫🇷', status: 'coming-soon', description: 'Coming Soon' },
		{ code: 'german', name: 'German', flag: '🇩🇪', status: 'coming-soon', description: 'Coming Soon' },
		{ code: 'italian', name: 'Italian', flag: '🇮🇹', status: 'coming-soon', description: 'Coming Soon' },
		{ code: 'japanese', name: 'Japanese', flag: '🇯🇵', status: 'coming-soon', description: 'Coming Soon' },
		{ code: 'korean', name: 'Korean', flag: '🇰🇷', status: 'coming-soon', description: 'Coming Soon' }
	];

	$: russianProgress = $lessonProgress['ru']?.length || 0;
</script>

<svelte:head>
	<title>LingoVibe - Learn Languages with Joy</title>
</svelte:head>

<div class="container">
	{#if $user}
		<div class="welcome-back">
			<h1>Welcome back, {$user.username}! 👋</h1>
			<p>Keep up the great work learning languages!</p>
		</div>

		<div class="stats-grid">
			<div class="stat-card">
				<div class="icon">⭐</div>
				<div class="value">{$totalXP}</div>
				<div class="label">Total XP</div>
			</div>
			<div class="stat-card">
				<div class="icon">📚</div>
				<div class="value">{russianProgress}</div>
				<div class="label">Lessons Completed</div>
			</div>
			<div class="stat-card">
				<div class="icon">🔥</div>
				<div class="value">{$streak}</div>
				<div class="label">Day Streak</div>
			</div>
		</div>
	{:else}
		<div class="hero-compact">
			<h1>Start Your Language Journey</h1>
			<p>Choose a language below to begin learning</p>
		</div>
	{/if}

	<h2>Available Courses</h2>
	<div class="grid grid-3">
		{#each languages as lang}
			{#if lang.status === 'available'}
				<a href="{base}/learn/{lang.code}" class="card card-clickable language-card-container">
					<div class="language-card">
						<div class="language-flag">{lang.flag}</div>
						<div class="language-info">
							<div class="language-name">{lang.name}</div>
							<span class="badge badge-success">{lang.description}</span>
						</div>
					</div>
				</a>
			{:else}
				<div class="card language-card-container locked">
					<div class="language-card">
						<div class="language-flag locked-flag">{lang.flag}</div>
						<div class="language-info">
							<div class="language-name">{lang.name}</div>
							<span class="badge badge-gray">{lang.description}</span>
						</div>
						<div class="lock-icon">🔒</div>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>
