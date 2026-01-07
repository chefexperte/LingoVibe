<script>
	/**
	 * Reusable progress bar component
	 * @component
	 */
	export let current = 0;
	export let total = 100;
	export let showPercentage = true;
	export let color = 'primary';

	$: percentage = total > 0 ? Math.round((current / total) * 100) : 0;
	$: displayPercentage = Math.min(percentage, 100);
</script>

<div class="lesson-progress-bar">
	<div class="lesson-progress-fill" style="width: {displayPercentage}%;" class:primary={color === 'primary'} class:secondary={color === 'secondary'}>
		{#if showPercentage && displayPercentage > 0}
			{displayPercentage}%
		{/if}
	</div>
</div>

<style>
	.lesson-progress-bar {
		background: var(--border-color);
		height: 20px;
		border-radius: 10px;
		overflow: hidden;
		width: 100%;
	}

	.lesson-progress-fill {
		height: 100%;
		transition: width 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 10px;
		color: white;
		font-size: 12px;
		font-weight: bold;
	}

	.lesson-progress-fill.primary {
		background: linear-gradient(90deg, var(--primary-color) 0%, #4cb002 100%);
	}

	.lesson-progress-fill.secondary {
		background: linear-gradient(90deg, var(--secondary-color) 0%, #1a9dd6 100%);
	}
</style>
