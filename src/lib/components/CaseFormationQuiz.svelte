<script>
	/**
	 * Case Formation Quiz Component (Fill-in-the-blank)
	 * User types the correct case form of a word
	 */
	import WiktionaryAttribution from './WiktionaryAttribution.svelte';
	import QuizFeedback from './QuizFeedback.svelte';
	import { validateAnswer } from '$lib/services/quizGenerator.js';

	export let quiz = null;
	export let onSubmit = () => {};
	export let onNext = () => {};

	let userAnswer = '';
	let submitted = false;
	let isCorrect = false;

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

<div class="case-formation-quiz">
	<!-- Subtle attribution at top-right -->
	<div class="quiz-attribution">
		<WiktionaryAttribution />
	</div>
	
	<div class="question-section">
		<h3 class="question-text">
			{quiz.question}
		</h3>
		
		<div class="word-display">
			<div class="word-russian">{quiz.word}</div>
			<div class="word-translation">({quiz.wordTranslation})</div>
		</div>

		<div class="case-info">
			<span class="case-badge">{quiz.targetCase}</span>
		</div>
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
				Next Question →
			</button>
		{/if}
	</div>

	{#if submitted}
		<QuizFeedback
			correct={isCorrect}
			userAnswer={userAnswer}
			correctAnswer={quiz.correctAnswer}
			declension={quiz.declension}
			word={quiz.word}
			wordTranslation={quiz.wordTranslation}
		/>
	{/if}
</div>

<style>
	.case-formation-quiz {
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

	.word-translation {
		font-size: 16px;
		color: var(--text-secondary);
	}

	.case-info {
		margin-top: 15px;
	}

	.case-badge {
		display: inline-block;
		padding: 8px 16px;
		background: var(--secondary-color);
		color: white;
		border-radius: 20px;
		font-size: 14px;
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

		.word-russian {
			font-size: 28px;
		}

		.word-translation {
			font-size: 14px;
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
