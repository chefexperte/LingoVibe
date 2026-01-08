<script>
	/**
	 * Case Formation Quiz Component (Fill-in-the-blank)
	 * User types the correct case form of a word
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

<div class="case-formation-quiz">
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
				<div class="word-russian">{quiz.word}</div>
				<div class="word-translation">({quiz.wordTranslation})</div>
			</div>
			<a 
				href="https://en.wiktionary.org/wiki/{quiz.word}#Russian"
				target="_blank"
				rel="noopener noreferrer"
				class="wiktionary-link"
				title="View on Wiktionary"
			>
				<span class="link-icon">📖</span>
				<span class="link-text">Wiktionary</span>
			</a>
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

	.word-translation {
		font-size: 16px;
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
