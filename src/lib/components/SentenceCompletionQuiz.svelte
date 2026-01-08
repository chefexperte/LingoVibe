<script>
	/**
	 * Sentence Completion Quiz Component
	 * User completes a sentence by providing the correct case form based on context
	 */
	import WiktionaryAttribution from './WiktionaryAttribution.svelte';
	import QuizFeedback from './QuizFeedback.svelte';
	import { validateAnswer } from '$lib/services/quizGenerator.js';
	import { quizState } from '$lib/stores/quizStore.js';

	export let quiz = null;
	export let onSubmit = () => {};
	export let onNext = () => {};

	let userAnswer = '';
	let submitted = false;
	let isCorrect = false;

	$: state = $quizState;
	$: isLastQuestion = state.currentQuestionIndex + 1 >= state.totalQuestions;

	function handleSubmit() {
		if (submitted || !userAnswer.trim()) return;

		isCorrect = validateAnswer(quiz, userAnswer);
		submitted = true;
		onSubmit(isCorrect, userAnswer);
	}

	function handleNext() {
		userAnswer = '';
		submitted = false;
		isCorrect = false;
		onNext();
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter' && !submitted) {
			handleSubmit();
		} else if (event.key === 'Enter' && submitted) {
			handleNext();
		}
	}
</script>

<div class="sentence-completion-quiz">
	<!-- Subtle attribution at top-right -->
	<div class="quiz-attribution">
		<WiktionaryAttribution />
	</div>
	
	<div class="question-section">
		<h3 class="question-text">
			{quiz.question}
		</h3>
		
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
			<strong>Use this word:</strong> 
			<span class="word-russian">{quiz.word}</span>
			<span class="word-translation">({quiz.wordTranslation})</span>
		</div>

		<!-- Case Hint (after submission) -->
		{#if submitted}
			<div class="case-hint">
				Required case: <span class="case-badge">{quiz.requiredCase}</span>
			</div>
		{/if}
	</div>

	<div class="answer-section">
		<input
			type="text"
			class="answer-input"
			bind:value={userAnswer}
			on:keypress={handleKeyPress}
			placeholder="Type your answer..."
			disabled={submitted}
			autocomplete="off"
			autocorrect="off"
			spellcheck="false"
		/>
		
		{#if !submitted}
			<button class="btn btn-primary submit-btn" on:click={handleSubmit} disabled={!userAnswer.trim()}>
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
			userAnswer={userAnswer}
			correctAnswer={quiz.correctAnswer}
			declension={quiz.declension}
			explanation={quiz.explanation}
			word={quiz.word}
			wordTranslation={quiz.wordTranslation}
		/>
	{/if}
</div>

<style>
	.sentence-completion-quiz {
		max-width: 650px;
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

	.word-russian {
		font-size: 20px;
		font-weight: bold;
		color: var(--text-color);
		margin: 0 5px;
	}

	.word-translation {
		color: var(--text-secondary);
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

	.answer-section {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 20px;
	}

	.answer-input {
		width: 100%;
		padding: 16px 20px;
		font-size: 18px;
		border: 2px solid var(--border-color);
		border-radius: var(--radius);
		background: var(--card-bg);
		color: var(--text-color);
		transition: border-color 0.2s;
		text-align: center;
	}

	.answer-input:focus {
		outline: none;
		border-color: var(--secondary-color);
	}

	.answer-input:disabled {
		background: var(--bg-color);
		cursor: not-allowed;
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

	@media (max-width: 768px) {
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

		.word-russian {
			font-size: 18px;
		}

		.answer-input {
			padding: 12px 16px;
			font-size: 16px;
		}

		.submit-btn,
		.next-btn {
			padding: 12px;
			font-size: 16px;
		}
	}
</style>
