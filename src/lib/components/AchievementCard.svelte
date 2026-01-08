<script>
	import { ACHIEVEMENT_TIERS } from '$lib/utils/achievements.js';
	
	export let achievement;
	export let compact = false;
</script>

<div class="achievement-card {compact ? 'compact' : ''} tier-{achievement.tier}">
	<div class="achievement-icon">{achievement.icon}</div>
	<div class="achievement-info">
		<h4 class="achievement-name">{achievement.name}</h4>
		<p class="achievement-description">{achievement.description}</p>
		<div class="achievement-reward">+{achievement.xpBonus} XP</div>
	</div>
	<div class="achievement-tier" style="background: {ACHIEVEMENT_TIERS[achievement.tier].color}">
		{ACHIEVEMENT_TIERS[achievement.tier].label}
	</div>
</div>

<style>
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

	.achievement-card.compact {
		padding: 15px;
	}

	.achievement-icon {
		font-size: 48px;
		flex-shrink: 0;
	}

	.achievement-card.compact .achievement-icon {
		font-size: 36px;
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

	.achievement-tier {
		position: absolute;
		top: 10px;
		right: 10px;
		padding: 4px 10px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 600;
		color: white;
		text-shadow: 0 1px 2px rgba(0,0,0,0.3);
	}
</style>
