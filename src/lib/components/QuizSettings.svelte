<script>
	/**
	 * Quiz settings component
	 * Allows users to configure quiz type, difficulty, and number of questions
	 */
	import { QUIZ_TYPES, DIFFICULTY_LEVELS } from '$lib/services/quizGenerator.js';
	import { calculateQuizXPRange } from '$lib/stores/quizStore.js';

	export let settings = {
		quizType: 'all',
		difficulty: 'medium',
		questionCount: 10,
		selectedCases: ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional']
	};
	
	export let onStart = () => {};

	// Russian cases for selection
	const allCases = [
		{ value: 'nominative', label: 'Nominative', russian: 'именительный' },
		{ value: 'genitive', label: 'Genitive', russian: 'родительный' },
		{ value: 'dative', label: 'Dative', russian: 'дательный' },
		{ value: 'accusative', label: 'Accusative', russian: 'винительный' },
		{ value: 'instrumental', label: 'Instrumental', russian: 'творительный' },
		{ value: 'prepositional', label: 'Prepositional', russian: 'предложный' }
	];

	$: xpRange = calculateQuizXPRange(settings);
	$: casesValid = settings.selectedCases && settings.selectedCases.length > 0;

	const quizTypeOptions = [
		{ value: QUIZ_TYPES.ALL, label: 'All Types (Mixed)', icon: '🎲' },
		{ value: QUIZ_TYPES.CASE_FORMATION, label: 'Case Formation (Fill-in)', icon: '✏️' },
		{ value: QUIZ_TYPES.CASE_FORMATION_MC, label: 'Case Formation (Multiple Choice)', icon: '☑️' },
		{ value: QUIZ_TYPES.CASE_IDENTIFICATION, label: 'Case Identification', icon: '🔍' },
		{ value: QUIZ_TYPES.SENTENCE_COMPLETION, label: 'Sentence Completion', icon: '💬' }
	];

	const difficultyOptions = [
		{ value: DIFFICULTY_LEVELS.EASY, label: 'Easy', description: 'Common words, basic cases', icon: '⭐' },
		{ value: DIFFICULTY_LEVELS.MEDIUM, label: 'Medium', description: 'Intermediate words, all cases', icon: '⭐⭐' },
		{ value: DIFFICULTY_LEVELS.HARD, label: 'Hard', description: 'Advanced words, complex forms', icon: '⭐⭐⭐' }
	];

	const questionCountOptions = [5, 10, 20];

	function toggleCase(caseValue) {
		if (!settings.selectedCases) {
			settings.selectedCases = [];
		}
		
		if (settings.selectedCases.includes(caseValue)) {
			// Don't allow deselecting if it's the last one
			if (settings.selectedCases.length > 1) {
				settings.selectedCases = settings.selectedCases.filter(c => c !== caseValue);
			}
		} else {
			settings.selectedCases = [...settings.selectedCases, caseValue];
		}
	}

	function handleStart() {
		if (!casesValid) return;
		onStart(settings);
	}
</script>

<div class="quiz-settings">
	<h3>Quiz Settings</h3>
	
	<!-- Quiz Type Selector -->
	<div class="setting-group" role="group" aria-labelledby="quiz-type-label">
		<span id="quiz-type-label" class="setting-label">Quiz Type</span>
		<div class="quiz-type-options">
			{#each quizTypeOptions as option}
				<button
					class="quiz-type-option {settings.quizType === option.value ? 'selected' : ''}"
					on:click={() => settings.quizType = option.value}
					aria-label={option.label}
					aria-pressed={settings.quizType === option.value}
				>
					<span class="option-icon" aria-hidden="true">{option.icon}</span>
					<span class="option-label">{option.label}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Difficulty Selector -->
	<div class="setting-group" role="group" aria-labelledby="difficulty-label">
		<span id="difficulty-label" class="setting-label">Quiz Difficulty</span>
		<div class="setting-subtitle">(affects which cases are tested)</div>
		<div class="difficulty-options">
			{#each difficultyOptions as option}
				<button
					class="difficulty-option {settings.difficulty === option.value ? 'selected' : ''}"
					on:click={() => settings.difficulty = option.value}
					aria-label="{option.label}: {option.description}"
					aria-pressed={settings.difficulty === option.value}
				>
					<div class="difficulty-icon" aria-hidden="true">{option.icon}</div>
					<div class="difficulty-content">
						<div class="difficulty-label">{option.label}</div>
						<div class="difficulty-description">{option.description}</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Question Count Selector -->
	<div class="setting-group" role="group" aria-labelledby="question-count-label">
		<span id="question-count-label" class="setting-label">Number of Questions</span>
		<div class="question-count-options">
			{#each questionCountOptions as count}
				<button
					class="count-option {settings.questionCount === count ? 'selected' : ''}"
					on:click={() => settings.questionCount = count}
					aria-label="{count} questions"
					aria-pressed={settings.questionCount === count}
				>
					{count}
				</button>
			{/each}
		</div>
	</div>

	<!-- Case Selection -->
	<div class="setting-group" role="group" aria-labelledby="cases-label">
		<span id="cases-label" class="setting-label">Cases to Test</span>
		<div class="setting-subtitle">(select at least one)</div>
		<div class="cases-grid">
			{#each allCases as caseOption}
				<button
					class="case-checkbox"
					class:selected={settings.selectedCases && settings.selectedCases.includes(caseOption.value)}
					on:click={() => toggleCase(caseOption.value)}
					aria-label={caseOption.label}
					aria-pressed={settings.selectedCases && settings.selectedCases.includes(caseOption.value)}
				>
					<span class="checkbox-icon">
						{#if settings.selectedCases && settings.selectedCases.includes(caseOption.value)}
							☑️
						{:else}
							☐
						{/if}
					</span>
					<span class="case-name">
						<span class="case-label">{caseOption.label}</span>
						<span class="case-russian">({caseOption.russian})</span>
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- XP Preview -->
	<div class="xp-preview">
		<div class="xp-preview-content">
			<span class="xp-icon">✨</span>
			<div class="xp-text">
				<span class="xp-label">Potential XP:</span>
				<span class="xp-range">{xpRange.minXP}-{xpRange.maxXP} XP</span>
			</div>
			<span class="xp-info" title="XP is based on difficulty, quiz type, number of questions, and your accuracy">ℹ️</span>
		</div>
	</div>

	<!-- Start Button -->
	<button class="btn btn-primary start-button" on:click={handleStart} disabled={!casesValid}>
		Start Quiz 🚀
	</button>
</div>

<style>
	.quiz-settings {
		background: var(--card-bg);
		padding: 30px;
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	h3 {
		margin-bottom: 25px;
		color: var(--text-color);
	}

	.setting-group {
		margin-bottom: 25px;
	}

	.setting-label {
		display: block;
		font-weight: 600;
		margin-bottom: 12px;
		color: var(--text-color);
		font-size: 15px;
	}

	.setting-subtitle {
		display: block;
		font-size: 12px;
		color: var(--text-secondary);
		margin-top: -8px;
		margin-bottom: 12px;
	}

	.quiz-type-options {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.quiz-type-option {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: var(--bg-color);
		border: 2px solid var(--border-color);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		font-size: 14px;
	}

	.quiz-type-option:hover {
		border-color: var(--secondary-color);
		transform: translateX(4px);
	}

	.quiz-type-option.selected {
		border-color: var(--secondary-color);
		background: #e8f7ff;
	}

	.option-icon {
		font-size: 20px;
	}

	.option-label {
		flex: 1;
		font-weight: 500;
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
		background: var(--bg-color);
		border: 2px solid var(--border-color);
		border-radius: 8px;
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
		font-size: 15px;
	}

	.difficulty-description {
		font-size: 13px;
		color: var(--text-secondary);
	}

	.difficulty-option.selected .difficulty-label {
		color: var(--primary-color);
	}

	.question-count-options {
		display: flex;
		gap: 12px;
	}

	.count-option {
		flex: 1;
		padding: 12px;
		background: var(--bg-color);
		border: 2px solid var(--border-color);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 16px;
		font-weight: 600;
	}

	.count-option:hover {
		border-color: var(--primary-color);
		transform: scale(1.05);
	}

	.count-option.selected {
		border-color: var(--primary-color);
		background: #f0ffe0;
		color: var(--primary-color);
	}

	.start-button {
		width: 100%;
		margin-top: 20px;
		font-size: 18px;
		padding: 16px;
	}

	.cases-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
	}

	.case-checkbox {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px;
		background: var(--bg-color);
		border: 2px solid var(--border-color);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.case-checkbox:hover {
		border-color: var(--primary-color);
		transform: translateY(-2px);
	}

	.case-checkbox.selected {
		border-color: var(--primary-color);
		background: #f0ffe0;
	}

	.checkbox-icon {
		font-size: 20px;
		flex-shrink: 0;
	}

	.case-name {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
	}

	.case-label {
		font-weight: 600;
		font-size: 14px;
		color: var(--text-color);
	}

	.case-russian {
		font-size: 11px;
		color: var(--text-secondary);
	}

	.xp-preview {
		margin-top: 20px;
		padding: 15px;
		background: linear-gradient(135deg, #fff9e6 0%, #ffe6cc 100%);
		border-radius: 8px;
		border: 2px solid #ffb700;
	}

	.xp-preview-content {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.xp-icon {
		font-size: 24px;
	}

	.xp-text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.xp-label {
		font-size: 12px;
		color: var(--text-secondary);
		font-weight: 600;
	}

	.xp-range {
		font-size: 18px;
		font-weight: bold;
		color: #ffb700;
	}

	.xp-info {
		font-size: 16px;
		cursor: help;
		opacity: 0.6;
	}

	@media (max-width: 768px) {
		.quiz-settings {
			padding: 20px;
		}

		.quiz-type-option,
		.difficulty-option {
			padding: 10px 12px;
		}

		.option-icon,
		.difficulty-icon {
			font-size: 18px;
		}

		.option-label,
		.difficulty-label {
			font-size: 13px;
		}

		.difficulty-description {
			font-size: 11px;
		}

		.count-option {
			padding: 10px;
			font-size: 14px;
		}

		.cases-grid {
			grid-template-columns: 1fr;
		}

		.case-label {
			font-size: 13px;
		}

		.xp-range {
			font-size: 16px;
		}
	}
</style>
