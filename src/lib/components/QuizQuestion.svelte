<script>
	/**
	 * Interactive quiz question component
	 * @component
	 */
	export let question = '';
	export let options = [];
	export let onAnswer = null;

	let selectedOption = null;
	let answered = false;
	let isCorrect = false;

	function handleAnswer(option, index) {
		if (answered) return;

		selectedOption = index;
		answered = true;
		isCorrect = option.correct;

		if (onAnswer) {
			onAnswer(option.correct);
		}
	}
</script>

<div class="quiz-question">
	<div class="question-text">{question}</div>
	<div class="quiz-options">
		{#each options as option, index}
			<button
				class="quiz-option"
				class:selected={selectedOption === index}
				class:correct={answered && option.correct}
				class:incorrect={answered && selectedOption === index && !option.correct}
				disabled={answered}
				on:click={() => handleAnswer(option, index)}
			>
				<span class="option-text">{option.text}</span>
				{#if answered && selectedOption === index}
					<span class="option-result">
						{#if option.correct}
							✓
						{:else}
							✗
						{/if}
					</span>
				{/if}
			</button>
		{/each}
	</div>

	{#if answered && selectedOption !== null}
		<div class="quiz-feedback" class:correct={isCorrect} class:incorrect={!isCorrect}>
			<div class="feedback-icon">
				{#if isCorrect}
					🎉
				{:else}
					💡
				{/if}
			</div>
			<div class="feedback-text">
				{options[selectedOption].explanation}
			</div>
		</div>
	{/if}
</div>

<style>
	.quiz-question {
		margin-bottom: 30px;
	}

	.question-text {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 20px;
		color: var(--text-color);
		line-height: 1.6;
	}

	.quiz-options {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 20px;
	}

	.quiz-option {
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

	.quiz-option:not(:disabled):hover {
		border-color: var(--secondary-color);
		transform: translateX(4px);
		box-shadow: var(--shadow);
	}

	.quiz-option:disabled {
		cursor: default;
	}

	.quiz-option.selected {
		border-color: var(--secondary-color);
		background: #e8f7ff;
	}

	.quiz-option.correct {
		border-color: var(--primary-color);
		background: #d7ffb8;
		animation: correctPulse 0.5s ease;
	}

	.quiz-option.incorrect {
		border-color: var(--danger-color);
		background: #ffe0e0;
		animation: incorrectShake 0.5s ease;
	}

	.option-text {
		flex: 1;
	}

	.option-result {
		font-size: 24px;
		margin-left: 10px;
	}

	.quiz-feedback {
		padding: 20px;
		border-radius: var(--radius);
		display: flex;
		gap: 15px;
		align-items: flex-start;
		animation: slideIn 0.3s ease;
	}

	.quiz-feedback.correct {
		background: #d7ffb8;
		border-left: 4px solid var(--primary-color);
	}

	.quiz-feedback.incorrect {
		background: #fff4cc;
		border-left: 4px solid var(--warning-color);
	}

	.feedback-icon {
		font-size: 32px;
	}

	.feedback-text {
		flex: 1;
		font-size: 15px;
		line-height: 1.6;
		color: var(--text-color);
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

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.question-text {
			font-size: 16px;
		}

		.quiz-option {
			padding: 12px 16px;
			font-size: 15px;
		}

		.feedback-icon {
			font-size: 24px;
		}
	}
</style>
