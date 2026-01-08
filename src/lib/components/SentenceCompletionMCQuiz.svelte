<script>
	/**
	 * Sentence Completion Multiple Choice Quiz Component
	 * User completes a sentence by selecting the correct case form from options
	 */
	import WiktionaryAttribution from './WiktionaryAttribution.svelte';
	import QuizFeedback from './QuizFeedback.svelte';
	import { quizState } from '$lib/stores/quizStore.js';

	export let quiz = null;
	export let onSubmit = () => {};
	export let onNext = () => {};

	let selectedOption = null;
	let submitted = false;
	let isCorrect = false;

	$: state = $quizState;
	$: isLastQuestion = state.currentQuestionIndex + 1 >= state.totalQuestions;

	function handleSelectOption(option) {
		if (submitted) return;
		selectedOption = option;
	}

	function handleSubmit() {
		if (submitted || !selectedOption) return;

		isCorrect = selectedOption.correct;
		submitted = true;
		onSubmit(isCorrect, selectedOption.text);
	}

	function handleNext() {
		selectedOption = null;
		submitted = false;
		isCorrect = false;
		onNext();
	}
</script>

<div class="sentence-completion-mc-quiz">
	<div class="question-section">
		<div class="question-header">
			<h3 class="question-text">
				{quiz.question}
			</h3>
			<div class="quiz-attribution">
				<WiktionaryAttribution />
			</div>
		</div>
		
		<!-- Russian Sentence -->
		<div class="sentence-display russian">
			{quiz.sentenceRussian}
		</div>

		<!-- English Translation -->
		<div class="sentence-display english">
			{quiz.sentenceEnglish}
		</div>

		<!-- Word to Use -->
		<div class="word-hint">
			<div class="word-hint-content">
				<div class="word-hint-text">
					<strong>Use this word:</strong> 
					<span class="word-russian">{quiz.word}</span>
					<span class="word-translation">({quiz.wordTranslation})</span>
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
		</div>

		<!-- Case Hint (after submission) -->
		{#if submitted}
			<div class="case-hint">
				Required case: <span class="case-badge">{quiz.requiredCase}</span>
			</div>
		{/if}
	</div>

	<!-- Multiple Choice Options -->
	<div class="options-section">
		{#each quiz.options as option}
			<button
				class="option-button 
					{selectedOption === option ? 'selected' : ''} 
					{submitted && option.correct ? 'correct' : ''}
					{submitted && selectedOption === option && !option.correct ? 'incorrect' : ''}"
				on:click={() => handleSelectOption(option)}
				disabled={submitted}
			>
				{option.text}
			</button>
		{/each}
	</div>

	<div class="answer-section">
		{#if !submitted}
			<button 
				class="btn btn-primary submit-btn" 
				on:click={handleSubmit} 
				disabled={!selectedOption}
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
			correct={isCorrect}
			userAnswer={selectedOption?.text}
			correctAnswer={quiz.correctAnswer}
			declension={quiz.declension}
			explanation={quiz.explanation}
			word={quiz.word}
			wordTranslation={quiz.wordTranslation}
		/>
	{/if}
</div>

<style>
	.sentence-completion-mc-quiz {
		max-width: 650px;
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

	.sentence-display {
		padding: 20px;
		border-radius: var(--radius);
		margin-bottom: 12px;
		font-size: 18px;
		line-height: 1.6;
	}

	.sentence-display.russian {
		background: var(--bg-color);
		color: var(--text-color);
		font-weight: 600;
		font-size: 24px;
	}

	.sentence-display.english {
		background: rgba(28, 176, 246, 0.1);
		color: var(--text-secondary);
		font-size: 16px;
		font-style: italic;
	}

	.word-hint {
		margin-top: 20px;
		padding: 15px;
		background: #fff4cc;
		border-radius: 8px;
		font-size: 16px;
	}

	.word-hint-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 15px;
		flex-wrap: wrap;
	}

	.word-hint-text {
		flex: 0 1 auto;
	}

	.word-russian {
		font-size: 20px;
		font-weight: bold;
		color: var(--text-color);
		margin: 0 5px;
	}

	.word-translation {
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
		flex-shrink: 0;
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

	.case-hint {
		margin-top: 15px;
		font-size: 14px;
		color: var(--text-secondary);
	}

	.case-badge {
		display: inline-block;
		padding: 4px 12px;
		background: var(--secondary-color);
		color: white;
		border-radius: 12px;
		font-size: 13px;
		font-weight: 600;
		text-transform: capitalize;
	}

	.options-section {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;
		margin-bottom: 25px;
	}

	.option-button {
		padding: 20px;
		font-size: 18px;
		border: 3px solid var(--border-color);
		background: white;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
		color: var(--text-color);
	}

	.option-button:hover:not(:disabled) {
		border-color: var(--secondary-color);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
	}

	.option-button.selected {
		border-color: var(--secondary-color);
		background: rgba(28, 176, 246, 0.1);
	}

	.option-button.correct {
		border-color: var(--primary-color);
		background: rgba(124, 195, 66, 0.2);
	}

	.option-button.incorrect {
		border-color: var(--danger-color);
		background: rgba(239, 68, 68, 0.1);
	}

	.option-button:disabled {
		cursor: not-allowed;
	}

	.answer-section {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}

	.submit-btn,
	.next-btn {
		min-width: 200px;
		padding: 16px 28px;
		font-size: 18px;
	}

	.submit-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.question-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
		}

		.sentence-completion-mc-quiz {
			padding: 0;
		}

		.question-text {
			font-size: 18px;
		}

		.sentence-display.russian {
			font-size: 20px;
			padding: 15px;
		}

		.sentence-display.english {
			font-size: 14px;
			padding: 12px;
		}

		.word-hint {
			font-size: 14px;
			padding: 12px;
		}

		.word-hint-content {
			flex-direction: column;
			gap: 10px;
		}

		.word-russian {
			font-size: 18px;
		}

		.options-section {
			grid-template-columns: 1fr;
		}

		.option-button {
			padding: 16px;
			font-size: 16px;
		}

		.submit-btn,
		.next-btn {
			width: 100%;
			padding: 14px;
			font-size: 16px;
		}
	}
</style>
