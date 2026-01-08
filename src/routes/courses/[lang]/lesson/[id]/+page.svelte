<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import LessonCard from '$lib/components/LessonCard.svelte';
	import WordCard from '$lib/components/WordCard.svelte';
	import QuizQuestion from '$lib/components/QuizQuestion.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { getLessonById } from '$lib/lessons/russian.js';
	import { fetchWordData } from '$lib/wiktionary.js';
	import { completeLesson, isLessonCompleted } from '$lib/stores/lessonStore.js';

	$: lang = $page.params.lang;
	$: lessonId = parseInt($page.params.id);
	$: lesson = getLessonById(lessonId);

	let currentSectionIndex = 0;
	let wordDataMap = {};
	let loadingWords = false;
	let quizAnswers = {};
	let lessonCompleted = false;

	$: currentSection = lesson?.sections[currentSectionIndex];
	$: isFirstSection = currentSectionIndex === 0;
	$: isLastSection = lesson && currentSectionIndex === lesson.sections.length - 1;
	$: progress = lesson ? ((currentSectionIndex + 1) / lesson.sections.length) * 100 : 0;

	onMount(async () => {
		if (!lesson) return;

		// Check if lesson is already completed
		lessonCompleted = isLessonCompleted(lang, lessonId);

		// Load word data for word examples section
		const wordSection = lesson.sections.find(s => s.type === 'words');
		if (wordSection?.content?.words) {
			loadingWords = true;
			try {
				const words = wordSection.content.words.map(w => w.word);
				const results = await Promise.all(
					words.map(async (word) => {
						const data = await fetchWordData(word);
						return [word, data];
					})
				);
				wordDataMap = Object.fromEntries(results);
			} catch (error) {
				console.error('Error loading word data:', error);
			} finally {
				loadingWords = false;
			}
		}
	});

	function nextSection() {
		if (!isLastSection) {
			currentSectionIndex++;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function previousSection() {
		if (!isFirstSection) {
			currentSectionIndex--;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function handleQuizAnswer(questionId, correct) {
		quizAnswers[questionId] = correct;
	}

	function handleCompleteLesson() {
		if (lesson) {
			completeLesson(lang, lessonId, lesson.xpReward);
			lessonCompleted = true;
		}
	}

	function goToNextLesson() {
		goto(`${base}/courses/${lang}/lesson/${lessonId + 1}`);
	}

	function goBackToLanguage() {
		goto(`${base}/courses/${lang}`);
	}
</script>

<svelte:head>
	<title>{lesson?.title || 'Lesson'} - LingoVibe</title>
</svelte:head>

<div class="container">
	{#if !lesson}
		<div class="card" style="text-align: center; padding: 60px 20px;">
			<h2>Lesson Not Found</h2>
			<p style="color: var(--text-secondary); margin: 20px 0;">The lesson you're looking for doesn't exist.</p>
			<button class="btn btn-primary" on:click={goBackToLanguage}>
				← Back to Lessons
			</button>
		</div>
	{:else}
		<!-- Lesson Header -->
		<div class="lesson-header card">
			<button class="back-button" on:click={goBackToLanguage}>
				← Back
			</button>
			<div class="lesson-header-content">
				<h1>{lesson.title}</h1>
				<div class="lesson-meta">
					<span class="badge badge-info">{lesson.type}</span>
					<span class="lesson-xp">🏆 {lesson.xpReward} XP</span>
				</div>
			</div>
			<div class="lesson-progress">
				<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
					<span style="font-size: 14px; font-weight: 600;">Progress</span>
					<span style="font-size: 14px; font-weight: 600;">
						Section {currentSectionIndex + 1} of {lesson.sections.length}
					</span>
				</div>
				<ProgressBar current={currentSectionIndex + 1} total={lesson.sections.length} />
			</div>
		</div>

		<!-- Section Content -->
		{#if currentSection}
			{#if currentSection.type === 'text'}
				<LessonCard title={currentSection.content.heading} type="text">
					<div class="section-text">
						{@html currentSection.content.text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/• /g, '<br>• ')}
					</div>
				</LessonCard>

			{:else if currentSection.type === 'words'}
				<LessonCard title={currentSection.content.heading} type="words">
					<p class="section-intro">{currentSection.content.text}</p>
					<div class="words-grid">
						{#each currentSection.content.words as wordItem}
							<WordCard 
								wordData={wordDataMap[wordItem.word]} 
								example={wordItem.example}
								loading={loadingWords}
							/>
						{/each}
					</div>
				</LessonCard>

			{:else if currentSection.type === 'quiz'}
				<LessonCard title={currentSection.content.heading} type="quiz">
					<p class="section-intro">{currentSection.content.text}</p>
					{#each currentSection.content.questions as question}
						<QuizQuestion
							question={question.question}
							options={question.options}
							onAnswer={(correct) => handleQuizAnswer(question.id, correct)}
						/>
					{/each}
				</LessonCard>

			{:else if currentSection.type === 'summary'}
				<LessonCard title={currentSection.content.heading} type="summary">
					<div class="summary-content">
						<h4 style="margin-bottom: 15px; font-size: 18px;">Key Takeaways:</h4>
						<ul class="takeaways-list">
							{#each currentSection.content.keyTakeaways as takeaway}
								<li>✓ {takeaway}</li>
							{/each}
						</ul>

						{#if !lessonCompleted}
							<div class="completion-section">
								<div class="xp-reward">
									<div class="xp-icon">🎉</div>
									<div>
										<div class="xp-text">Lesson Complete!</div>
										<div class="xp-amount">+{lesson.xpReward} XP</div>
									</div>
								</div>
								<button class="btn btn-primary btn-large" on:click={handleCompleteLesson}>
									Complete Lesson
								</button>
							</div>
						{:else}
							<div class="completed-badge">
								<span style="font-size: 48px;">✓</span>
								<h3>Lesson Completed!</h3>
								<p>You've earned {lesson.xpReward} XP</p>
							</div>
						{/if}

						{#if currentSection.content.nextLesson}
							<div class="next-lesson-preview">
								<h4 style="margin-bottom: 10px;">Next Lesson:</h4>
								<div class="next-lesson-card">
									<div class="next-lesson-info">
										<div class="next-lesson-title">{currentSection.content.nextLesson.title}</div>
										<div class="next-lesson-preview-text">{currentSection.content.nextLesson.preview}</div>
									</div>
									<button class="btn btn-secondary" on:click={goToNextLesson}>
										Start Next →
									</button>
								</div>
							</div>
						{/if}
					</div>
				</LessonCard>
			{/if}
		{/if}

		<!-- Navigation Buttons -->
		<div class="lesson-navigation">
			<button 
				class="btn btn-secondary" 
				on:click={previousSection}
				disabled={isFirstSection}
			>
				← Previous
			</button>
			<button 
				class="btn btn-primary" 
				on:click={nextSection}
				disabled={isLastSection}
			>
				{isLastSection ? 'Complete' : 'Continue'} →
			</button>
		</div>
	{/if}
</div>

<style>
	.lesson-header {
		margin-bottom: 30px;
		position: relative;
	}

	.back-button {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 16px;
		padding: 8px 0;
		margin-bottom: 15px;
		transition: color 0.2s;
	}

	.back-button:hover {
		color: var(--primary-color);
	}

	.lesson-header-content h1 {
		font-size: 32px;
		margin-bottom: 15px;
		color: var(--text-color);
	}

	.lesson-meta {
		display: flex;
		gap: 15px;
		align-items: center;
		margin-bottom: 20px;
	}

	.lesson-xp {
		font-weight: 600;
		color: var(--primary-color);
	}

	.section-text {
		font-size: 16px;
		line-height: 1.8;
	}

	.section-intro {
		font-size: 16px;
		margin-bottom: 24px;
		color: var(--text-secondary);
	}

	.words-grid {
		display: grid;
		gap: 16px;
	}

	.summary-content {
		font-size: 16px;
	}

	.takeaways-list {
		list-style: none;
		padding: 0;
		margin-bottom: 30px;
	}

	.takeaways-list li {
		padding: 12px;
		margin-bottom: 8px;
		background: white;
		border-radius: 8px;
		border-left: 3px solid var(--primary-color);
	}

	.completion-section {
		background: white;
		padding: 30px;
		border-radius: var(--radius);
		text-align: center;
		margin: 30px 0;
	}

	.xp-reward {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		margin-bottom: 20px;
	}

	.xp-icon {
		font-size: 64px;
	}

	.xp-text {
		font-size: 24px;
		font-weight: bold;
		color: var(--text-color);
	}

	.xp-amount {
		font-size: 32px;
		font-weight: bold;
		color: var(--primary-color);
	}

	.btn-large {
		padding: 16px 48px;
		font-size: 18px;
	}

	.completed-badge {
		text-align: center;
		padding: 40px;
		background: white;
		border-radius: var(--radius);
		margin: 30px 0;
	}

	.completed-badge h3 {
		font-size: 24px;
		margin: 15px 0 10px;
		color: var(--primary-color);
	}

	.next-lesson-preview {
		margin-top: 30px;
		padding: 20px;
		background: white;
		border-radius: var(--radius);
	}

	.next-lesson-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		padding: 20px;
		background: var(--bg-color);
		border-radius: 8px;
	}

	.next-lesson-info {
		flex: 1;
	}

	.next-lesson-title {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.next-lesson-preview-text {
		font-size: 14px;
		color: var(--text-secondary);
	}

	.lesson-navigation {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		margin-top: 30px;
		margin-bottom: 40px;
	}

	.lesson-navigation .btn {
		flex: 1;
		max-width: 200px;
	}

	.lesson-navigation .btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.lesson-header-content h1 {
			font-size: 24px;
		}

		.xp-icon {
			font-size: 48px;
		}

		.xp-text {
			font-size: 20px;
		}

		.xp-amount {
			font-size: 24px;
		}

		.next-lesson-card {
			flex-direction: column;
			text-align: center;
		}

		.lesson-navigation .btn {
			max-width: none;
		}
	}
</style>
