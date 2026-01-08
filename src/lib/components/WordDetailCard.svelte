<script>
	export let wordData;

	$: isMastered =
		wordData.proficiency.percentage === 100 && wordData.proficiency.correct >= 10;

	$: proficiencyColor = (() => {
		const p = wordData.proficiency.percentage;
		if (p === 100) return '#4ade80'; // green
		if (p >= 75) return '#60a5fa'; // blue
		if (p >= 50) return '#fbbf24'; // yellow
		return '#f87171'; // red
	})();

	function formatDate(isoString) {
		const date = new Date(isoString);
		const now = new Date();
		const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;
		return date.toLocaleDateString();
	}
</script>

<div class="word-card {isMastered ? 'mastered' : ''}">
	<div class="word-header">
		<div class="word-main">
			<div class="word-russian">{wordData.word}</div>
			<div class="word-translation">{wordData.translation}</div>
		</div>
		{#if isMastered}
			<div class="mastered-badge">✅ Mastered</div>
		{/if}
	</div>

	<!-- Metadata -->
	<div class="word-metadata">
		{#if wordData.metadata.gender}
			<span class="meta-tag gender-{wordData.metadata.gender}">
				{wordData.metadata.gender}
			</span>
		{/if}
		{#if wordData.metadata.animacy}
			<span class="meta-tag">
				{wordData.metadata.animacy}
			</span>
		{/if}
		{#if wordData.metadata.difficulty}
			<span class="meta-tag difficulty-{wordData.metadata.difficulty}">
				{wordData.metadata.difficulty}
			</span>
		{/if}
		<span class="meta-tag"> Frequency: {wordData.metadata.frequency}/10 </span>
	</div>

	<!-- Overall Proficiency -->
	<div class="proficiency-section">
		<div class="proficiency-header">
			<span class="proficiency-label">Overall Proficiency</span>
			<span class="proficiency-value" style="color: {proficiencyColor}">
				{wordData.proficiency.percentage}%
			</span>
		</div>
		<div class="proficiency-bar">
			<div
				class="proficiency-fill"
				style="width: {wordData.proficiency.percentage}%; background: {proficiencyColor}"
			></div>
		</div>
		<div class="proficiency-stats">
			<span>{wordData.proficiency.correct} / {wordData.proficiency.total} correct</span>
			<span class="proficiency-hint">
				{#if wordData.proficiency.percentage === 100 && wordData.proficiency.correct < 10}
					({10 - wordData.proficiency.correct} more to master!)
				{/if}
			</span>
		</div>
	</div>

	<!-- Form-Specific Proficiency (if noun/verb) -->
	{#if Object.keys(wordData.forms).length > 0}
		<div class="forms-section">
			<div class="forms-header">Form Proficiency</div>
			<div class="forms-grid">
				{#each Object.entries(wordData.forms) as [form, data]}
					<div class="form-item">
						<div class="form-name">{form}</div>
						<div class="form-progress">
							<div class="form-bar">
								<div class="form-fill" style="width: {data.percentage}%"></div>
							</div>
							<span class="form-percent">{data.percentage}%</span>
						</div>
						<div class="form-stats">
							{data.correct}/{data.total}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Practice Info -->
	<div class="practice-info">
		<div class="info-item">
			<span class="info-label">First seen:</span>
			<span class="info-value">{formatDate(wordData.firstSeen)}</span>
		</div>
		<div class="info-item">
			<span class="info-label">Last practiced:</span>
			<span class="info-value">{formatDate(wordData.lastPracticed)}</span>
		</div>
		<div class="info-item">
			<span class="info-label">Times encountered:</span>
			<span class="info-value">{wordData.timesEncountered}</span>
		</div>
	</div>
</div>

<style>
	.word-card {
		background: var(--card-bg);
		border-radius: var(--radius);
		padding: 20px;
		box-shadow: var(--shadow);
		transition: transform 0.2s;
	}

	.word-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}

	.word-card.mastered {
		border: 2px solid var(--primary-color);
	}

	.word-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 15px;
	}

	.word-russian {
		font-size: 28px;
		font-weight: 700;
		color: var(--text-color);
		margin-bottom: 5px;
	}

	.word-translation {
		font-size: 16px;
		color: var(--text-secondary);
	}

	.mastered-badge {
		background: var(--primary-color);
		color: white;
		padding: 6px 12px;
		border-radius: 20px;
		font-size: 14px;
		font-weight: 600;
	}

	.word-metadata {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 20px;
	}

	.meta-tag {
		background: var(--bg-color);
		padding: 4px 10px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 600;
		text-transform: capitalize;
	}

	.meta-tag.gender-masculine {
		background: #dbeafe;
		color: #1e40af;
	}

	.meta-tag.gender-feminine {
		background: #fce7f3;
		color: #9f1239;
	}

	.meta-tag.gender-neuter {
		background: #f3e8ff;
		color: #6b21a8;
	}

	.meta-tag.difficulty-common {
		background: #dcfce7;
		color: #166534;
	}

	.meta-tag.difficulty-intermediate {
		background: #fef3c7;
		color: #92400e;
	}

	.meta-tag.difficulty-advanced {
		background: #fee2e2;
		color: #991b1b;
	}

	.proficiency-section {
		margin-bottom: 20px;
	}

	.proficiency-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.proficiency-label {
		font-size: 14px;
		font-weight: 600;
	}

	.proficiency-value {
		font-size: 18px;
		font-weight: 700;
	}

	.proficiency-bar {
		height: 12px;
		background: var(--bg-color);
		border-radius: 6px;
		overflow: hidden;
		margin-bottom: 5px;
	}

	.proficiency-fill {
		height: 100%;
		transition: width 0.3s ease;
		border-radius: 6px;
	}

	.proficiency-stats {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: var(--text-secondary);
	}

	.proficiency-hint {
		font-style: italic;
		color: var(--primary-color);
	}

	.forms-section {
		margin-bottom: 20px;
		padding-top: 20px;
		border-top: 1px solid var(--border-color);
	}

	.forms-header {
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 12px;
	}

	.forms-grid {
		display: grid;
		gap: 10px;
	}

	.form-item {
		display: grid;
		grid-template-columns: 100px 1fr 60px;
		align-items: center;
		gap: 10px;
	}

	.form-name {
		font-size: 13px;
		font-weight: 500;
		text-transform: capitalize;
	}

	.form-progress {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.form-bar {
		flex: 1;
		height: 8px;
		background: var(--bg-color);
		border-radius: 4px;
		overflow: hidden;
	}

	.form-fill {
		height: 100%;
		background: var(--primary-color);
		transition: width 0.3s ease;
	}

	.form-percent {
		font-size: 12px;
		font-weight: 600;
		min-width: 40px;
	}

	.form-stats {
		font-size: 12px;
		color: var(--text-secondary);
		text-align: right;
	}

	.practice-info {
		padding-top: 15px;
		border-top: 1px solid var(--border-color);
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		font-size: 13px;
	}

	.info-label {
		color: var(--text-secondary);
	}

	.info-value {
		font-weight: 600;
	}
</style>
