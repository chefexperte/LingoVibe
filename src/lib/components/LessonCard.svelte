<script>
	/**
	 * Reusable card component for lesson content sections
	 * @component
	 */
	export let title = '';
	export let type = 'default';
</script>

<div class="lesson-card" class:text={type === 'text'} class:words={type === 'words'} class:quiz={type === 'quiz'} class:summary={type === 'summary'}>
	{#if title}
		<h3 class="lesson-card-title">{title}</h3>
	{/if}
	<div class="lesson-card-content">
		<slot />
	</div>
</div>

<style>
	.lesson-card {
		background: var(--card-bg);
		border-radius: var(--radius);
		padding: 30px;
		margin-bottom: 24px;
		box-shadow: var(--shadow);
		border-left: 4px solid var(--primary-color);
	}

	.lesson-card.text {
		border-left-color: var(--secondary-color);
	}

	.lesson-card.words {
		border-left-color: var(--primary-color);
	}

	.lesson-card.quiz {
		border-left-color: var(--warning-color);
	}

	.lesson-card.summary {
		border-left-color: var(--primary-color);
		background: linear-gradient(135deg, #f0fff0 0%, #e0ffe0 100%);
	}

	.lesson-card-title {
		font-size: 24px;
		margin-bottom: 20px;
		color: var(--text-color);
	}

	.lesson-card-content {
		color: var(--text-color);
		line-height: 1.8;
	}

	@media (max-width: 768px) {
		.lesson-card {
			padding: 20px;
		}

		.lesson-card-title {
			font-size: 20px;
		}
	}
</style>
