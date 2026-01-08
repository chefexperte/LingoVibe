<script>
	import { ACHIEVEMENTS } from '$lib/utils/achievements.js';
	import { unlockedAchievements } from '$lib/stores/achievementStore.js';
	import AchievementCard from '$lib/components/AchievementCard.svelte';

	$: unlocked = ACHIEVEMENTS.filter(a => $unlockedAchievements.includes(a.id));
	$: locked = ACHIEVEMENTS.filter(a => !$unlockedAchievements.includes(a.id));
</script>

<svelte:head>
	<title>Achievements - LingoVibe</title>
</svelte:head>

<div class="achievements-page">
	<div class="achievements-header">
		<h1>🏆 Achievements</h1>
		<p>Unlock achievements by completing lessons and challenges</p>
		<div class="achievement-stats">
			<span class="stat-badge">{unlocked.length} / {ACHIEVEMENTS.length} Unlocked</span>
		</div>
	</div>

	{#if unlocked.length > 0}
		<section class="achievements-section">
			<h2>Unlocked</h2>
			<div class="achievements-grid">
				{#each unlocked as achievement}
					<AchievementCard {achievement} />
				{/each}
			</div>
		</section>
	{/if}

	{#if locked.length > 0}
		<section class="achievements-section locked-section">
			<h2>Locked</h2>
			<div class="achievements-grid">
				{#each locked as achievement}
					<div class="achievement-card locked">
						<div class="achievement-icon grayscale">{achievement.icon}</div>
						<div class="achievement-info">
							<h4 class="achievement-name">???</h4>
							<p class="achievement-description">{achievement.description}</p>
							<div class="achievement-reward">+{achievement.xpBonus} XP</div>
						</div>
						<div class="lock-icon">🔒</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.achievements-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.achievements-header {
		text-align: center;
		margin-bottom: 40px;
	}

	.achievements-header h1 {
		font-size: 36px;
		margin-bottom: 10px;
	}

	.achievements-header p {
		font-size: 18px;
		color: var(--text-secondary);
	}

	.achievement-stats {
		margin-top: 20px;
	}

	.stat-badge {
		background: var(--primary-color);
		color: white;
		padding: 10px 20px;
		border-radius: 20px;
		font-weight: 600;
	}

	.achievements-section {
		margin-bottom: 40px;
	}

	.achievements-section h2 {
		margin-bottom: 20px;
		font-size: 24px;
	}

	.achievements-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}

	.locked-section .achievement-card {
		opacity: 0.6;
		position: relative;
	}

	.achievement-card {
		background: var(--card-bg);
		border-radius: var(--radius);
		padding: 20px;
		display: flex;
		align-items: center;
		gap: 15px;
		box-shadow: var(--shadow);
		position: relative;
		overflow: hidden;
	}

	.achievement-icon {
		font-size: 48px;
		flex-shrink: 0;
	}

	.grayscale {
		filter: grayscale(100%);
	}

	.achievement-info {
		flex: 1;
	}

	.achievement-name {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 5px;
	}

	.achievement-description {
		font-size: 14px;
		color: var(--text-secondary);
		margin-bottom: 5px;
	}

	.achievement-reward {
		font-size: 14px;
		color: var(--primary-color);
		font-weight: 600;
	}

	.lock-icon {
		position: absolute;
		top: 50%;
		right: 20px;
		transform: translateY(-50%);
		font-size: 32px;
		opacity: 0.5;
	}

	@media (max-width: 768px) {
		.achievements-header h1 {
			font-size: 28px;
		}

		.achievements-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
