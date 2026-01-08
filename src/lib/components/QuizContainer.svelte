<script>
	/**
	 * Quiz Container Component
	 * Main quiz interface that orchestrates quiz flow
	 */
	import { onMount } from 'svelte';
	import { generateQuiz, QUIZ_TYPES } from '$lib/services/quizGenerator.js';
	import { 
		quizState, 
		quizProgress, 
		quizAccuracy,
		setCurrentQuiz,
		submitAnswer,
		nextQuestion,
		endQuiz,
		calculateQuizXP
	} from '$lib/stores/quizStore.js';
	import { addXP } from '$lib/stores/lessonStore.js';
	import { trackWord, recordPractice } from '$lib/stores/vocabularyStore.js';
	import CaseFormationQuiz from './CaseFormationQuiz.svelte';
	import CaseIdentificationQuiz from './CaseIdentificationQuiz.svelte';
	import SentenceCompletionQuiz from './SentenceCompletionQuiz.svelte';

	export let onComplete = () => {};

	let loading = false;
	let error = null;
	let currentQuiz = null;
	let showResults = false;
	let finalResults = null;
	let earnedXP = 0;

	$: state = $quizState;
	$: progress = $quizProgress;
	$: accuracy = $quizAccuracy;

	onMount(() => {
		loadNextQuiz();
	});

	async function loadNextQuiz() {
		loading = true;
		error = null;

		try {
			// Defensive check: ensure we haven't exceeded question limit
			// Check both currentQuestionIndex and answers.length to prevent edge cases
			if (state.answers.length >= state.totalQuestions) {
				showResultsScreen();
				return;
			}
			
			// Check if quiz is complete (backup check)
			if (state.currentQuestionIndex >= state.totalQuestions) {
				showResultsScreen();
				return;
			}

			// Generate next quiz question
			const quiz = await generateQuiz(
				state.settings.quizType,
				state.settings.difficulty,
				state.usedWords,
				state.settings.selectedCases
			);

			currentQuiz = quiz;
			setCurrentQuiz(quiz);
			
			// Track word when encountered
			trackWord({
				word: quiz.word,
				translation: quiz.wordTranslation,
				type: 'noun',
				metadata: {
					gender: quiz.declension?.gender,
					animacy: quiz.declension?.animacy,
					difficulty: quiz.difficulty
				}
			});
		} catch (err) {
			console.error('Error loading quiz:', err);
			error = 'Failed to load quiz. Please try again.';
		} finally {
			loading = false;
		}
	}

	function handleSubmit(correct, userAnswer) {
		submitAnswer(correct, userAnswer);
		
		// Record practice attempt
		// For case identification quizzes, track all correct cases
		// For other quiz types, use the targetCase
		if (currentQuiz.type === 'case-identification' && currentQuiz.correctCases) {
			// Record practice for each correct case
			currentQuiz.correctCases.forEach(caseName => {
				recordPractice(currentQuiz.word, correct, caseName);
			});
		} else {
			const form = currentQuiz.targetCase || null;
			recordPractice(currentQuiz.word, correct, form);
		}
	}

	function handleNext() {
		nextQuestion();
		currentQuiz = null;
		loadNextQuiz();
	}

	function showResultsScreen() {
		finalResults = endQuiz();
		
		// Calculate and award XP
		earnedXP = calculateQuizXP(state.settings, finalResults.accuracy);
		addXP(earnedXP);
		
		showResults = true;
		onComplete(finalResults);
	}

	function getQuizComponent(quizType) {
		switch (quizType) {
			case QUIZ_TYPES.CASE_FORMATION:
			case QUIZ_TYPES.CASE_FORMATION_MC:
				return CaseFormationQuiz;
			case QUIZ_TYPES.CASE_IDENTIFICATION:
				return CaseIdentificationQuiz;
			case QUIZ_TYPES.SENTENCE_COMPLETION:
				return SentenceCompletionQuiz;
			default:
				return CaseFormationQuiz;
		}
	}
</script>

<div class="quiz-container">
	{#if !showResults}
		<!-- Progress Header -->
		<div class="quiz-header">
			<div class="progress-info">
				<span class="question-number">
					Question {state.currentQuestionIndex + 1} of {state.totalQuestions}
				</span>
				<span class="accuracy-badge">
					Accuracy: {accuracy}%
				</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progress}%">
					{#if progress > 10}
						{progress}%
					{/if}
				</div>
			</div>
		</div>

		<!-- Quiz Content -->
		<div class="quiz-content">
			{#if loading}
				<div class="loading-state">
					<div class="spinner"></div>
					<p>Loading question...</p>
				</div>
			{:else if error}
				<div class="error-state">
					<p class="error-message">❌ {error}</p>
					<button class="btn btn-primary" on:click={loadNextQuiz}>
						Try Again
					</button>
				</div>
			{:else if currentQuiz}
				<svelte:component 
					this={getQuizComponent(currentQuiz.type)}
					quiz={currentQuiz}
					onSubmit={handleSubmit}
					onNext={handleNext}
				/>
			{/if}
		</div>

		<!-- Footer Attribution -->
		<div class="quiz-footer">
			<small>Powered by Wiktionary</small>
		</div>
	{:else if finalResults}
		<!-- Results Screen -->
		<div class="results-screen">
			<div class="results-header">
				<h2>Quiz Complete! 🎉</h2>
				<div class="final-score">
					<div class="score-circle">
						<span class="score-value">{finalResults.accuracy}%</span>
						<span class="score-label">Accuracy</span>
					</div>
				</div>
			</div>

			<div class="results-stats">
				<div class="stat-item">
					<div class="stat-value">{finalResults.score}/{finalResults.totalQuestions}</div>
					<div class="stat-label">Correct Answers</div>
				</div>
				<div class="stat-item">
					<div class="stat-value">{finalResults.totalQuestions}</div>
					<div class="stat-label">Questions</div>
				</div>
				<div class="stat-item xp-stat">
					<div class="stat-value">+{earnedXP} XP</div>
					<div class="stat-label">Experience Earned</div>
				</div>
			</div>

			<div class="results-message">
				{#if finalResults.accuracy >= 90}
					<p>🌟 Outstanding! You have excellent Russian grammar skills!</p>
				{:else if finalResults.accuracy >= 70}
					<p>✨ Great job! You're making good progress!</p>
				{:else if finalResults.accuracy >= 50}
					<p>👍 Good effort! Keep practicing to improve!</p>
				{:else}
					<p>💪 Keep learning! Practice makes perfect!</p>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.quiz-container {
		max-width: 800px;
		margin: 0 auto;
	}

	.quiz-header {
		background: var(--card-bg);
		padding: 20px;
		border-radius: var(--radius);
		margin-bottom: 20px;
		box-shadow: var(--shadow);
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		font-size: 15px;
	}

	.question-number {
		font-weight: 600;
		color: var(--text-color);
	}

	.accuracy-badge {
		background: var(--primary-color);
		color: white;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 13px;
		font-weight: 600;
	}

	.progress-bar {
		background: var(--border-color);
		height: 24px;
		border-radius: 12px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--primary-color) 0%, #4cb002 100%);
		transition: width 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 12px;
		color: white;
		font-size: 13px;
		font-weight: bold;
	}

	.quiz-content {
		background: var(--card-bg);
		padding: 30px;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		min-height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-state {
		text-align: center;
		color: var(--text-secondary);
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 4px solid var(--border-color);
		border-top-color: var(--primary-color);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 20px;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.error-state {
		text-align: center;
	}

	.error-message {
		color: var(--danger-color);
		margin-bottom: 20px;
		font-size: 16px;
	}

	.quiz-footer {
		text-align: center;
		margin-top: 20px;
		color: var(--text-secondary);
		font-size: 12px;
	}

	.results-screen {
		background: var(--card-bg);
		padding: 40px;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		text-align: center;
	}

	.results-header h2 {
		font-size: 32px;
		margin-bottom: 30px;
		color: var(--text-color);
	}

	.final-score {
		margin: 30px 0;
	}

	.score-circle {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 180px;
		height: 180px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--primary-color) 0%, #4cb002 100%);
		color: white;
		box-shadow: 0 8px 24px rgba(88, 204, 2, 0.3);
	}

	.score-value {
		font-size: 48px;
		font-weight: bold;
		line-height: 1;
	}

	.score-label {
		font-size: 16px;
		margin-top: 8px;
		opacity: 0.9;
	}

	.results-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		margin: 30px 0;
	}

	.stat-item {
		padding: 20px;
		background: var(--bg-color);
		border-radius: var(--radius);
	}

	.stat-value {
		font-size: 32px;
		font-weight: bold;
		color: var(--primary-color);
		margin-bottom: 5px;
	}

	.stat-label {
		font-size: 14px;
		color: var(--text-secondary);
	}

	.xp-stat .stat-value {
		color: #ffb700;
	}

	.results-message {
		margin-top: 30px;
		padding: 20px;
		background: #f0ffe0;
		border-radius: var(--radius);
		font-size: 18px;
		color: var(--text-color);
	}

	@media (max-width: 1024px) and (min-width: 769px) {
		.results-stats {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.quiz-header {
			padding: 15px;
		}

		.progress-info {
			font-size: 13px;
		}

		.progress-bar {
			height: 20px;
		}

		.quiz-content {
			padding: 20px;
		}

		.results-screen {
			padding: 25px;
		}

		.results-header h2 {
			font-size: 24px;
		}

		.score-circle {
			width: 140px;
			height: 140px;
		}

		.score-value {
			font-size: 36px;
		}

		.score-label {
			font-size: 14px;
		}

		.results-stats {
			grid-template-columns: 1fr;
			gap: 15px;
		}

		.stat-value {
			font-size: 24px;
		}

		.results-message {
			font-size: 16px;
			padding: 15px;
		}
	}
</style>
