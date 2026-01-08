<script>
	import { recentlyUnlocked } from '$lib/stores/achievementStore.js';
	import { scale } from 'svelte/transition';
</script>

{#if $recentlyUnlocked}
	<div class="achievement-popup" transition:scale={{ duration: 300 }}>
		<div class="popup-content">
			<div class="popup-header">
				<span class="popup-title">🎉 Achievement Unlocked!</span>
			</div>
			<div class="popup-body">
				<div class="popup-icon">{$recentlyUnlocked.icon}</div>
				<div class="popup-info">
					<h3>{$recentlyUnlocked.name}</h3>
					<p>{$recentlyUnlocked.description}</p>
					<div class="popup-xp">+{$recentlyUnlocked.xpBonus} XP</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.achievement-popup {
		position: fixed;
		top: 80px;
		right: 20px;
		z-index: 1000;
		max-width: 400px;
	}

	.popup-content {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 10px 40px rgba(0,0,0,0.3);
	}

	.popup-header {
		margin-bottom: 15px;
	}

	.popup-title {
		font-size: 18px;
		font-weight: 700;
		text-shadow: 0 2px 4px rgba(0,0,0,0.2);
	}

	.popup-body {
		display: flex;
		gap: 15px;
		align-items: center;
	}

	.popup-icon {
		font-size: 64px;
		filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
	}

	.popup-info h3 {
		font-size: 20px;
		font-weight: 600;
		margin-bottom: 5px;
	}

	.popup-info p {
		font-size: 14px;
		opacity: 0.9;
		margin-bottom: 8px;
	}

	.popup-xp {
		background: rgba(255,255,255,0.2);
		padding: 6px 12px;
		border-radius: 20px;
		display: inline-block;
		font-weight: 600;
		font-size: 14px;
	}

	@media (max-width: 768px) {
		.achievement-popup {
			right: 10px;
			left: 10px;
			max-width: none;
		}
	}
</style>
