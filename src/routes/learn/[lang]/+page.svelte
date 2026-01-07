<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { getAllLessons } from '$lib/lessons/russian.js';
	import { lessonProgress, totalXP } from '$lib/stores/lessonStore.js';

	const languageData = {
		spanish: { name: 'Spanish', flag: '🇪🇸', status: 'coming-soon' },
		french: { name: 'French', flag: '🇫🇷', status: 'coming-soon' },
		german: { name: 'German', flag: '🇩🇪', status: 'coming-soon' },
		italian: { name: 'Italian', flag: '🇮🇹', status: 'coming-soon' },
		japanese: { name: 'Japanese', flag: '🇯🇵', status: 'coming-soon' },
		korean: { name: 'Korean', flag: '🇰🇷', status: 'coming-soon' },
		ru: { name: 'Russian', flag: '🇷🇺', status: 'available' }
	};

	$: lang = $page.params.lang;
	$: currentLang = languageData[lang] || { name: 'Unknown', flag: '🌍', status: 'unknown' };
	$: isRussian = lang === 'ru';
	$: lessons = isRussian ? getAllLessons() : [];
	$: completedLessons = $lessonProgress[lang]?.length || 0;
</script>

<svelte:head>
	<title>{currentLang.name} - LingoVibe</title>
</svelte:head>

<div class="container">
	<div class="card" style="margin-bottom: 30px;">
		<div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
			<span style="font-size: 64px;">{currentLang.flag}</span>
			<div>
				<h2 style="margin-bottom: 10px;">{currentLang.name}</h2>
				{#if currentLang.status === 'available'}
					<span class="badge badge-success">Available Now</span>
				{:else if currentLang.status === 'coming-soon'}
					<span class="badge badge-warning">Coming Soon</span>
				{:else}
					<span class="badge badge-gray">Not Available</span>
				{/if}
			</div>
		</div>

		{#if isRussian}
			<div>
				<div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
					<span style="font-weight: 600;">Progress</span>
					<span style="font-weight: 600; color: var(--primary-color);">{completedLessons} / {lessons.length} Lessons</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {lessons.length > 0 ? (completedLessons / lessons.length * 100) : 0}%;">
						{lessons.length > 0 ? Math.round(completedLessons / lessons.length * 100) : 0}%
					</div>
				</div>
			</div>
		{/if}
	</div>

	{#if currentLang.status === 'coming-soon'}
		<div class="coming-soon-message">
			<div class="coming-soon-icon">🚧</div>
			<h2>Coming Soon!</h2>
			<p>We're working hard to bring you an amazing {currentLang.name} learning experience.</p>
			<p>In the meantime, check out our <a href="{base}/learn/ru">Russian course</a> which is fully available!</p>
		</div>
	{:else if currentLang.status === 'unknown'}
		<div class="coming-soon-message">
			<div class="coming-soon-icon">❓</div>
			<h2>Language Not Found</h2>
			<p>This language is not available yet.</p>
			<p><a href="{base}/">Return to home</a> to see available courses.</p>
		</div>
	{:else}
		<h2>Lesson Path</h2>
		<div>
			{#each lessons as lesson}
				{#if lesson.status === 'available'}
					<a href="{base}/learn/{lang}/lesson/{lesson.id}" class="lesson-item {lesson.status}">
						<div class="lesson-icon {lesson.type} {lesson.status === 'completed' ? 'completed' : ''}">
							{lesson.icon}
						</div>
						<div class="lesson-content">
							<div class="lesson-title">{lesson.title}</div>
							<div class="lesson-type">{lesson.type === 'vocab' ? 'Vocabulary' : 'Grammar'}</div>
						</div>
						{#if lesson.status === 'completed'}
							<div class="lesson-status">✓</div>
						{:else if lesson.status === 'locked'}
							<div class="lesson-status">🔒</div>
						{/if}
					</a>
				{:else}
					<div class="lesson-item {lesson.status}">
						<div class="lesson-icon {lesson.type} {lesson.status === 'completed' ? 'completed' : ''}">
							{lesson.icon}
						</div>
						<div class="lesson-content">
							<div class="lesson-title">{lesson.title}</div>
							<div class="lesson-type">{lesson.type === 'vocab' ? 'Vocabulary' : 'Grammar'}</div>
						</div>
						{#if lesson.status === 'completed'}
							<div class="lesson-status">✓</div>
						{:else if lesson.status === 'locked'}
							<div class="lesson-status">🔒</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.coming-soon-message {
		text-align: center;
		padding: 60px 20px;
		background: var(--card-bg);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	.coming-soon-icon {
		font-size: 80px;
		margin-bottom: 20px;
	}

	.coming-soon-message h2 {
		font-size: 32px;
		margin-bottom: 15px;
		color: var(--text-color);
	}

	.coming-soon-message p {
		font-size: 18px;
		color: var(--text-secondary);
		margin-bottom: 10px;
	}

	.coming-soon-message a {
		color: var(--primary-color);
		font-weight: 600;
		text-decoration: none;
	}

	.coming-soon-message a:hover {
		text-decoration: underline;
	}
</style>
