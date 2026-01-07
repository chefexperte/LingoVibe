<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { getAllLessons } from '$lib/lessons/russian.js';

	const languageData = {
		spanish: { name: 'Spanish', flag: '🇪🇸' },
		french: { name: 'French', flag: '🇫🇷' },
		german: { name: 'German', flag: '🇩🇪' },
		italian: { name: 'Italian', flag: '🇮🇹' },
		japanese: { name: 'Japanese', flag: '🇯🇵' },
		korean: { name: 'Korean', flag: '🇰🇷' },
		ru: { name: 'Russian', flag: '🇷🇺' }
	};

	$: lang = $page.params.lang;
	$: currentLang = languageData[lang] || { name: 'Unknown', flag: '🌍' };

	// Default lessons for other languages
	const defaultLessons = [
		{ id: 1, title: 'Basic Greetings', type: 'vocab', status: 'completed', icon: '✓' },
		{ id: 2, title: 'Common Phrases', type: 'grammar', status: 'completed', icon: '✓' },
		{ id: 3, title: 'Numbers 1-10', type: 'vocab', status: 'available', icon: '📚' },
		{ id: 4, title: 'Present Tense Verbs', type: 'grammar', status: 'available', icon: '✏️' },
		{ id: 5, title: 'Food & Drinks', type: 'vocab', status: 'locked', icon: '🔒' },
		{ id: 6, title: 'Past Tense', type: 'grammar', status: 'locked', icon: '🔒' }
	];

	// Get Russian lessons or use defaults
	$: lessons = lang === 'ru' ? getAllLessons() : defaultLessons;
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
				<span class="badge badge-success">Level 1 - Beginner</span>
			</div>
		</div>

		<div>
			<div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
				<span style="font-weight: 600;">Daily XP Goal</span>
				<span style="font-weight: 600; color: var(--primary-color);">30 / 50 XP</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: 60%;">60%</div>
			</div>
		</div>
	</div>

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
</div>
