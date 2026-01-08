<script>
	/**
	 * Case Identification Quiz Component (Multiple Choice)
	 * User identifies which case(s) a declined word is in
	 */
	import WiktionaryAttribution from './WiktionaryAttribution.svelte';
	import QuizFeedback from './QuizFeedback.svelte';
	import { validateMultipleAnswer } from '$lib/services/quizGenerator.js';

	export let quiz = null;
	export let onSubmit = () => {};
	export let onNext = () => {};

	let selectedCases = [];
	let submitted = false;
	let validationResult = null;

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
	<!-- Subtle attribution at top-right -->
	<div class="quiz-attribution">
		<WiktionaryAttribution />
	</div>
	
	<div class="question-section">
		<h3 class="question-text">
			{quiz.question}
		</h3>
		
		<div class="word-display">
			<div class="word-russian">{quiz.declinedWord}</div>
			<div class="word-info">
				Base form: <strong>{quiz.word}</strong> ({quiz.wordTranslation})
			</div>
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
				Next Question →
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

	.quiz-attribution {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 10;
	}

	.question-section {
		text-align: center;
		margin-bottom: 30px;
	}

	.question-text {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 20px;
		color: var(--text-color);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.word-display {
		background: var(--bg-color);
		padding: 20px;
		border-radius: var(--radius);
		margin-bottom: 15px;
	}

	.word-russian {
		font-size: 36px;
		font-weight: bold;
		color: var(--text-color);
		margin-bottom: 8px;
	}

	.word-info {
		font-size: 14px;
		color: var(--text-secondary);
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
		.question-text {
			font-size: 18px;
		}

		.word-russian {
			font-size: 28px;
		}

		.word-info {
			font-size: 13px;
		}

		.case-option {
			padding: 12px 16px;
			font-size: 15px;
		}

		.submit-btn,
		.next-btn {
			padding: 12px;
			font-size: 16px;
		}
	}
</style>
