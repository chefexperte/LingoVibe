<script>
	/**
	 * Case Identification Quiz Component (Multiple Choice)
	 * User identifies which case(s) a declined word is in
	 */
	import WiktionaryAttribution from './WiktionaryAttribution.svelte';
	import QuizFeedback from './QuizFeedback.svelte';
	import { validateMultipleAnswer } from '$lib/services/quizGenerator.js';
	import { quizState } from '$lib/stores/quizStore.js';

	export let quiz = null;
	export let onSubmit = () => {};
	export let onNext = () => {};

	let selectedCases = [];
	let submitted = false;
	let validationResult = null;

	$: state = $quizState;
	$: isLastQuestion = state.currentQuestionIndex + 1 >= state.totalQuestions;

	function toggleCase(caseName) {
		if (submitted) return;

		if (selectedCases.includes(caseName)) {
			selectedCases = selectedCases.filter(c => c !== caseName);
		} else {
			selectedCases = [...selectedCases, caseName];
		}
	}

	function handleSubmit() {
		if (submitted || selectedCases.length === 0) return;

		validationResult = validateMultipleAnswer(quiz, selectedCases);
		submitted = true;
		onSubmit(validationResult.correct, selectedCases.join(', '));
	}

	function handleNext() {
		selectedCases = [];
		submitted = false;
		validationResult = null;
		onNext();
	}
</script>

<div class="case-identification-quiz">
	<div class="question-section">
		<div class="question-header">
			<h3 class="question-text">
				{quiz.question}
			</h3>
			<div class="quiz-attribution">
				<WiktionaryAttribution />
			</div>
		</div>
		
		<div class="word-display">
			<div class="word-info">
				<div class="word-russian">{quiz.declinedWord}</div>
				<div class="word-detail">
					Base form: <strong>{quiz.word}</strong> ({quiz.wordTranslation})
				</div>
			</div>
			<a 
				href="https://en.wiktionary.org/wiki/{encodeURIComponent(quiz.word)}#Russian"
				target="_blank"
				rel="noopener noreferrer"
				class="wiktionary-link"
				title="View on Wiktionary"
			>
				<span class="link-icon">📖</span>
				<span class="link-text">Wiktionary</span>
			</a>
		</div>

		{#if quiz.multipleCorrect}
			<div class="hint">
				💡 Multiple answers may be correct
			</div>
		{/if}
	</div>

	<div class="options-section">
		{#each quiz.options as option}
			<button
				class="case-option"
				class:selected={selectedCases.includes(option.value)}
				class:correct={submitted && option.correct}
				class:incorrect={submitted && selectedCases.includes(option.value) && !option.correct}
				on:click={() => toggleCase(option.value)}
				disabled={submitted}
			>
				<span class="option-text">{option.text}</span>
				{#if submitted}
					<span class="option-result">
						{#if option.correct}
							✓
						{:else if selectedCases.includes(option.value)}
							✗
						{/if}
					</span>
				{/if}
			</button>
		{/each}
	</div>

	<div class="action-section">
		{#if !submitted}
			<button 
				class="btn btn-primary submit-btn" 
				on:click={handleSubmit}
				disabled={selectedCases.length === 0}
			>
				Check Answer
			</button>
		{:else}
			<button class="btn btn-secondary next-btn" on:click={handleNext}>
				{isLastQuestion ? 'Show Results 🎉' : 'Next Question →'}
			</button>
		{/if}
	</div>

	{#if submitted}
		<QuizFeedback
			correct={validationResult.correct}
			userAnswer={selectedCases.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
			correctAnswer={quiz.correctCases.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
			declension={quiz.declension}
			word={quiz.word}
			wordTranslation={quiz.wordTranslation}
		/>
	{/if}
</div>

<style>
	.case-identification-quiz {
		max-width: 600px;
		margin: 0 auto;
		position: relative;
	}

	.question-section {
		text-align: center;
		margin-bottom: 30px;
	}

	.question-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 15px;
		margin-bottom: 20px;
	}

	.question-text {
		flex: 1;
		font-size: 20px;
		font-weight: 600;
		color: var(--text-color);
		text-align: left;
	}

	.quiz-attribution {
		flex-shrink: 0;
	}

	.word-display {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		background: var(--bg-color);
		padding: 20px;
		border-radius: var(--radius);
		margin-bottom: 15px;
	}

	.word-info {
		text-align: center;
	}

	.word-russian {
		font-size: 36px;
		font-weight: bold;
		color: var(--text-color);
		margin-bottom: 8px;
	}

	.word-detail {
		font-size: 14px;
		color: var(--text-secondary);
	}

	.wiktionary-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		background: #f3f4f6;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		text-decoration: none;
		color: var(--text-color);
		font-size: 14px;
		font-weight: 500;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.wiktionary-link:hover {
		background: #e5e7eb;
		border-color: #9ca3af;
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.link-icon {
		font-size: 16px;
	}

	.link-text {
		font-size: 13px;
	}

	.hint {
		padding: 10px;
		background: #fff4cc;
		border-radius: 8px;
		font-size: 14px;
		color: var(--text-color);
		margin-top: 10px;
	}

	.options-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 20px;
	}

	.case-option {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 20px;
		background: var(--card-bg);
		border: 2px solid var(--border-color);
		border-radius: var(--radius);
		font-size: 16px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.case-option:not(:disabled):hover {
		border-color: var(--secondary-color);
		transform: translateX(4px);
		box-shadow: var(--shadow);
	}

	.case-option:disabled {
		cursor: default;
	}

	.case-option.selected {
		border-color: var(--secondary-color);
		background: #e8f7ff;
	}

	.case-option.correct {
		border-color: var(--primary-color);
		background: #d7ffb8;
		animation: correctPulse 0.5s ease;
	}

	.case-option.incorrect {
		border-color: var(--danger-color);
		background: #ffe0e0;
		animation: incorrectShake 0.5s ease;
	}

	.option-text {
		flex: 1;
		font-weight: 500;
	}

	.option-result {
		font-size: 24px;
		margin-left: 10px;
	}

	.action-section {
		margin-bottom: 20px;
	}

	.submit-btn,
	.next-btn {
		width: 100%;
		padding: 16px;
		font-size: 18px;
	}

	.submit-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@keyframes correctPulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.02); }
	}

	@keyframes incorrectShake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-5px); }
		75% { transform: translateX(5px); }
	}

	@media (max-width: 768px) {
		.case-identification-quiz {
			padding: 0;
		}

		.question-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
		}

		.question-text {
			font-size: 18px;
		}

		.word-display {
			flex-direction: column;
			gap: 15px;
		}

		.word-russian {
			font-size: 28px;
		}

		.word-detail {
			font-size: 13px;
		}

		.wiktionary-link {
			width: 100%;
			justify-content: center;
		}

		.case-option {
			padding: 14px 16px;
			font-size: 15px;
		}

		.submit-btn,
		.next-btn {
			width: 100%;
			padding: 14px;
			font-size: 16px;
		}
	}
</style>
