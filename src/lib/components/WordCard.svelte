<script>
	/**
	 * Card component for displaying Russian words with Wiktionary data
	 * @component
	 */
	import WiktionaryAttribution from './WiktionaryAttribution.svelte';
	
	export let wordData = null;
	export let example = '';
	export let loading = false;

	$: hasData = wordData && !loading;
</script>

<div class="word-card">
	{#if loading}
		<div class="word-loading">
			<div class="spinner"></div>
			<p>Loading word data...</p>
		</div>
	{:else if hasData}
		<div class="word-header">
			<div class="word-russian">
				{wordData.word}
				<WiktionaryAttribution />
			</div>
			<div class="word-transliteration">{wordData.transliteration}</div>
		</div>
		<div class="word-translation">
			<strong>Translation:</strong> {wordData.translation}
		</div>
		<div class="word-cases">
			<div class="case-item nominative">
				<span class="case-label">Nominative:</span>
				<span class="case-value">{wordData.cases.nominative}</span>
			</div>
			<div class="case-item">
				<span class="case-label">Accusative:</span>
				<span class="case-value">{wordData.cases.accusative}</span>
			</div>
			<div class="case-item">
				<span class="case-label">Genitive:</span>
				<span class="case-value">{wordData.cases.genitive}</span>
			</div>
		</div>
		{#if example}
			<div class="word-example">
				<strong>Example:</strong> {example}
			</div>
		{/if}
	{:else}
		<div class="word-error">
			<p>⚠️ Unable to load word data</p>
		</div>
	{/if}
</div>

<style>
	.word-card {
		background: var(--card-bg);
		border-radius: var(--radius);
		padding: 20px;
		margin-bottom: 16px;
		box-shadow: var(--shadow);
		border: 2px solid var(--border-color);
		transition: all 0.2s;
	}

	.word-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-hover);
		border-color: var(--primary-color);
	}

	.word-header {
		margin-bottom: 12px;
	}

	.word-russian {
		font-size: 32px;
		font-weight: bold;
		color: var(--text-color);
		font-family: 'Times New Roman', serif;
		margin-bottom: 5px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.word-transliteration {
		font-size: 16px;
		color: var(--text-secondary);
		font-style: italic;
	}

	.word-translation {
		font-size: 16px;
		margin-bottom: 15px;
		padding: 10px;
		background: var(--bg-color);
		border-radius: 8px;
	}

	.word-cases {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 15px;
	}

	.case-item {
		display: flex;
		justify-content: space-between;
		padding: 8px 12px;
		background: var(--bg-color);
		border-radius: 6px;
	}

	.case-item.nominative {
		background: #d7ffb8;
		font-weight: 600;
	}

	.case-label {
		color: var(--text-secondary);
		font-size: 14px;
	}

	.case-value {
		font-family: 'Times New Roman', serif;
		font-size: 16px;
		font-weight: 600;
		color: var(--text-color);
	}

	.case-item.nominative .case-label,
	.case-item.nominative .case-value {
		color: var(--primary-color);
	}

	.word-example {
		font-size: 15px;
		padding: 10px;
		background: #e8f7ff;
		border-radius: 8px;
		border-left: 3px solid var(--secondary-color);
		font-family: 'Times New Roman', serif;
	}

	.word-loading,
	.word-error {
		text-align: center;
		padding: 20px;
		color: var(--text-secondary);
	}

	.spinner {
		border: 3px solid var(--border-color);
		border-top: 3px solid var(--primary-color);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
		margin: 0 auto 10px;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (max-width: 768px) {
		.word-russian {
			font-size: 24px;
		}

		.word-cases {
			font-size: 14px;
		}
	}
</style>
