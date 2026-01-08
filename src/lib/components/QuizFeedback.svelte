<script>
	/**
	 * Quiz feedback component
	 * Shows answer correctness, full declension table, and Wiktionary attribution
	 */

	export let correct = false;
	export let userAnswer = '';
	export let correctAnswer = '';
	export let declension = null;
	export let explanation = '';
	export let word = '';
	export let wordTranslation = '';

	const cases = ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional'];
	
	function getCaseLabel(caseName) {
		return caseName.charAt(0).toUpperCase() + caseName.slice(1);
	}
</script>

<div class="quiz-feedback {correct ? 'correct' : 'incorrect'}">
	<!-- Feedback Header -->
	<div class="feedback-header">
		<div class="feedback-icon">
			{#if correct}
				✅
			{:else}
				❌
			{/if}
		</div>
		<div class="feedback-message">
			{#if correct}
				<h4>Correct!</h4>
				<p>Great job! Your answer is right.</p>
			{:else}
				<h4>Not quite</h4>
				<p>
					You answered: <strong>{userAnswer || '(empty)'}</strong><br />
					Correct answer: <strong>{correctAnswer}</strong>
				</p>
			{/if}
		</div>
	</div>

	<!-- Explanation -->
	{#if explanation}
		<div class="explanation">
			<strong>💡 Tip:</strong> {explanation}
		</div>
	{/if}

	<!-- Declension Table -->
	{#if declension}
		<div class="declension-table">
			<div class="table-header">
				<h5>Full Declension of "{word}" ({wordTranslation})</h5>
			</div>
			
			<div class="table-grid">
				<div class="table-column">
					<div class="column-header">Singular</div>
					{#each cases as caseName}
						<div class="case-row">
							<span class="case-label">{getCaseLabel(caseName)}:</span>
							<span class="case-value">{declension.declension.singular[caseName]}</span>
						</div>
					{/each}
				</div>
				
				<div class="table-column">
					<div class="column-header">Plural</div>
					{#each cases as caseName}
						<div class="case-row">
							<span class="case-label">{getCaseLabel(caseName)}:</span>
							<span class="case-value">{declension.declension.plural[caseName]}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="table-footer">
				<small>
					Gender: <strong>{declension.gender || 'unknown'}</strong> | 
					Animacy: <strong>{declension.animacy || 'unknown'}</strong>
				</small>
			</div>
		</div>
	{/if}
</div>

<style>
	.quiz-feedback {
		padding: 20px;
		border-radius: var(--radius);
		margin-top: 20px;
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

	.feedback-header {
		display: flex;
		gap: 15px;
		align-items: flex-start;
		margin-bottom: 15px;
	}

	.feedback-icon {
		font-size: 32px;
		flex-shrink: 0;
	}

	.feedback-message {
		flex: 1;
	}

	.feedback-message h4 {
		margin: 0 0 5px 0;
		font-size: 18px;
		color: var(--text-color);
	}

	.feedback-message p {
		margin: 0;
		font-size: 14px;
		color: var(--text-color);
		line-height: 1.6;
	}

	.explanation {
		padding: 12px;
		background: rgba(255, 255, 255, 0.7);
		border-radius: 8px;
		margin-bottom: 15px;
		font-size: 14px;
		line-height: 1.6;
	}

	.declension-table {
		background: rgba(255, 255, 255, 0.9);
		border-radius: 8px;
		padding: 15px;
		margin-top: 15px;
	}

	.table-header {
		margin-bottom: 15px;
	}

	.table-header h5 {
		margin: 0;
		font-size: 16px;
		color: var(--text-color);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.table-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.table-column {
		border: 1px solid var(--border-color);
		border-radius: 8px;
		overflow: hidden;
	}

	.column-header {
		background: var(--bg-color);
		padding: 8px;
		font-weight: 600;
		font-size: 14px;
		text-align: center;
		border-bottom: 1px solid var(--border-color);
	}

	.case-row {
		padding: 8px 12px;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid var(--border-color);
		font-size: 14px;
	}

	.case-row:last-child {
		border-bottom: none;
	}

	.case-label {
		color: var(--text-secondary);
		font-weight: 500;
	}

	.case-value {
		color: var(--text-color);
		font-weight: 600;
	}

	.table-footer {
		margin-top: 10px;
		text-align: center;
		color: var(--text-secondary);
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
		.quiz-feedback {
			padding: 15px;
		}

		.feedback-icon {
			font-size: 24px;
		}

		.feedback-message h4 {
			font-size: 16px;
		}

		.feedback-message p {
			font-size: 13px;
		}

		.table-grid {
			grid-template-columns: 1fr;
			gap: 15px;
		}

		.case-row {
			padding: 6px 10px;
			font-size: 13px;
		}
	}
</style>
