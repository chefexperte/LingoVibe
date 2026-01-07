<script>
	/**
	 * Component for selecting word difficulty/commonness level
	 * Used in quizzes and practice sessions
	 */
	export let selected = 'common';
	export let onChange = () => {};

	const difficulties = [
		{ value: 'common', label: 'Common Words', description: 'Most frequently used words', icon: '⭐' },
		{ value: 'intermediate', label: 'Intermediate', description: 'Moderately common words', icon: '⭐⭐' },
		{ value: 'advanced', label: 'Advanced', description: 'Less common vocabulary', icon: '⭐⭐⭐' }
	];

	function handleChange(value) {
		selected = value;
		onChange(value);
	}
</script>

<div class="difficulty-selector">
	<label class="selector-label">Word Difficulty</label>
	<div class="difficulty-options">
		{#each difficulties as difficulty}
			<button
				class="difficulty-option {selected === difficulty.value ? 'selected' : ''}"
				on:click={() => handleChange(difficulty.value)}
			>
				<div class="difficulty-icon">{difficulty.icon}</div>
				<div class="difficulty-content">
					<div class="difficulty-label">{difficulty.label}</div>
					<div class="difficulty-description">{difficulty.description}</div>
				</div>
			</button>
		{/each}
	</div>
</div>

<style>
	.difficulty-selector {
		margin: 20px 0;
	}

	.selector-label {
		display: block;
		font-weight: 600;
		margin-bottom: 12px;
		color: var(--text-color);
		font-size: 16px;
	}

	.difficulty-options {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.difficulty-option {
		display: flex;
		align-items: center;
		gap: 15px;
		padding: 15px;
		background: var(--card-bg);
		border: 2px solid var(--border-color);
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.difficulty-option:hover {
		border-color: var(--primary-color);
		transform: translateY(-2px);
		box-shadow: var(--shadow);
	}

	.difficulty-option.selected {
		border-color: var(--primary-color);
		background: #f0ffe0;
		box-shadow: var(--shadow);
	}

	.difficulty-icon {
		font-size: 24px;
		flex-shrink: 0;
	}

	.difficulty-content {
		flex: 1;
	}

	.difficulty-label {
		font-weight: 600;
		color: var(--text-color);
		margin-bottom: 4px;
	}

	.difficulty-description {
		font-size: 14px;
		color: var(--text-secondary);
	}

	.difficulty-option.selected .difficulty-label {
		color: var(--primary-color);
	}

	@media (max-width: 768px) {
		.difficulty-option {
			padding: 12px;
			gap: 12px;
		}

		.difficulty-icon {
			font-size: 20px;
		}

		.difficulty-label {
			font-size: 14px;
		}

		.difficulty-description {
			font-size: 12px;
		}
	}
</style>
