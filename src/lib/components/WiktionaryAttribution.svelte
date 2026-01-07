<script>
	/**
	 * Component to display Wiktionary attribution
	 * Shows an info icon with tooltip
	 */
	let showTooltip = false;
</script>

<div class="wiktionary-attribution">
	<button 
		class="info-icon"
		on:mouseenter={() => showTooltip = true}
		on:mouseleave={() => showTooltip = false}
		on:click={() => showTooltip = !showTooltip}
		aria-label="Data source information"
	>
		ℹ️
	</button>
	
	{#if showTooltip}
		<div class="tooltip">
			Data sourced from Wiktionary
		</div>
	{/if}
</div>

<style>
	.wiktionary-attribution {
		position: relative;
		display: inline-block;
	}

	.info-icon {
		background: none;
		border: none;
		font-size: 14px;
		cursor: pointer;
		padding: 2px 4px;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.info-icon:hover {
		opacity: 1;
	}

	.tooltip {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: 5px;
		background: var(--text-color);
		color: white;
		padding: 6px 12px;
		border-radius: 6px;
		font-size: 12px;
		white-space: nowrap;
		z-index: 1000;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.tooltip::before {
		content: '';
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-bottom-color: var(--text-color);
	}

	@media (max-width: 768px) {
		.tooltip {
			font-size: 11px;
			padding: 5px 10px;
		}
	}
</style>
