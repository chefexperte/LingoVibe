<script>
	/**
	 * Mobile sidebar navigation
	 * @component
	 */
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/userStore.js';
	import { totalXP, streak } from '$lib/stores/lessonStore.js';
	import { isGithubAuthenticated, githubUser } from '$lib/stores/syncStore.js';
	import { masteredWords, vocabularyStats } from '$lib/stores/vocabularyStore.js';
	import { unlockedAchievements } from '$lib/stores/achievementStore.js';
	
	export let isOpen = false;
	export let onClose = () => {};
	
	function handleNavClick() {
		onClose();
	}
	
	function handleOverlayClick() {
		onClose();
	}
	
	function handleKeyDown(event) {
		if (event.key === 'Escape' && isOpen) {
			onClose();
		}
	}
	
	onMount(() => {
		// Add escape key listener when component mounts
		window.addEventListener('keydown', handleKeyDown);
		
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
	
	$: isActive = (path) => {
		if (path === '/') {
			return $page.url.pathname === `${base}/` || $page.url.pathname === `${base}`;
		}
		return $page.url.pathname.startsWith(`${base}${path}`);
	};
</script>

{#if isOpen}
	<div 
		class="sidebar-overlay" 
		on:click={handleOverlayClick}
		on:keydown={(e) => e.key === 'Enter' && handleOverlayClick()}
		role="button"
		tabindex="-1"
		aria-label="Close sidebar"
	></div>
	
	<nav class="sidebar" class:open={isOpen}>
		<!-- User Info Section -->
		{#if $user}
			<div class="sidebar-user">
				{#if $isGithubAuthenticated && $githubUser}
					<img 
						src={$githubUser.avatar_url} 
						alt={$githubUser.login}
						class="user-avatar"
					/>
					<div class="user-details">
						<div class="username">{$githubUser.login}</div>
						<div class="user-xp">{$totalXP} XP</div>
					</div>
				{:else}
					<div class="user-icon">👤</div>
					<div class="user-details">
						<div class="username">{$user.username}</div>
						<div class="user-xp">{$totalXP} XP</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Navigation Links -->
		<div class="sidebar-nav">
			<a 
				href="{base}/" 
				class="nav-item {isActive('/') ? 'active' : ''}"
				on:click={handleNavClick}
			>
				<span class="nav-icon">🏠</span>
				<span class="nav-label">Home</span>
			</a>

			<a 
				href="{base}/courses" 
				class="nav-item {isActive('/courses') ? 'active' : ''}"
				on:click={handleNavClick}
			>
				<span class="nav-icon">📚</span>
				<span class="nav-label">Courses</span>
			</a>

			<a 
				href="{base}/practice" 
				class="nav-item {isActive('/practice') ? 'active' : ''}"
				on:click={handleNavClick}
			>
				<span class="nav-icon">✏️</span>
				<span class="nav-label">Practice</span>
			</a>

			<!-- Vocabulary Link with Badge -->
			<a 
				href="{base}/vocabulary" 
				class="nav-item {isActive('/vocabulary') ? 'active' : ''}"
				on:click={handleNavClick}
			>
				<span class="nav-icon">📖</span>
				<span class="nav-label">Vocabulary</span>
				{#if $masteredWords.length > 0}
					<span class="nav-badge">{$masteredWords.length}</span>
				{/if}
			</a>

			<!-- Achievements Link with Badge -->
			<a 
				href="{base}/achievements" 
				class="nav-item {isActive('/achievements') ? 'active' : ''}"
				on:click={handleNavClick}
			>
				<span class="nav-icon">🏆</span>
				<span class="nav-label">Achievements</span>
				{#if $unlockedAchievements.length > 0}
					<span class="nav-badge">{$unlockedAchievements.length}</span>
				{/if}
			</a>

			<!-- Settings (if authenticated) -->
			{#if $isGithubAuthenticated}
				<a 
					href="{base}/settings" 
					class="nav-item {isActive('/settings') ? 'active' : ''}"
					on:click={handleNavClick}
				>
					<span class="nav-icon">⚙️</span>
					<span class="nav-label">Settings</span>
				</a>
			{/if}
		</div>

		<!-- Quick Stats (Mobile-specific) -->
		{#if $user}
			<div class="sidebar-stats">
				<div class="stat-item">
					<span class="stat-icon">⭐</span>
					<span class="stat-text">{$totalXP} XP</span>
				</div>
				<div class="stat-item">
					<span class="stat-icon">🔥</span>
					<span class="stat-text">{$streak} Day Streak</span>
				</div>
				<div class="stat-item">
					<span class="stat-icon">📖</span>
					<span class="stat-text">{$vocabularyStats.total} Words</span>
				</div>
			</div>
		{/if}

		<!-- Close Button -->
		<button class="sidebar-close" on:click={onClose} aria-label="Close menu">
			✕
		</button>
	</nav>
{/if}

<style>
	.sidebar-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 998;
		animation: fadeIn 0.3s;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.sidebar {
		position: fixed;
		top: 0;
		left: -300px;
		width: 280px;
		height: 100vh;
		background: var(--card-bg);
		box-shadow: 2px 0 10px rgba(0,0,0,0.1);
		z-index: 999;
		transition: left 0.3s ease;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.sidebar.open {
		left: 0;
	}

	.sidebar-user {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 20px;
		border-bottom: 1px solid var(--border-color);
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
		color: white;
	}

	.user-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 2px solid white;
	}

	.user-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		background: rgba(255,255,255,0.2);
		border-radius: 50%;
	}

	.user-details {
		flex: 1;
	}

	.username {
		font-weight: 600;
		font-size: 16px;
		margin-bottom: 4px;
	}

	.user-xp {
		font-size: 14px;
		opacity: 0.9;
	}

	.sidebar-nav {
		flex: 1;
		padding: 10px 0;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 20px;
		color: var(--text-color);
		text-decoration: none;
		transition: all 0.2s;
		position: relative;
	}

	.nav-item:hover {
		background: var(--bg-color);
	}

	.nav-item.active {
		background: var(--bg-color);
		border-left: 4px solid var(--primary-color);
		color: var(--primary-color);
		font-weight: 600;
	}

	.nav-icon {
		font-size: 20px;
		width: 28px;
		text-align: center;
	}

	.nav-label {
		font-size: 15px;
		flex: 1;
	}

	.nav-badge {
		background: var(--primary-color);
		color: white;
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 600;
		min-width: 24px;
		text-align: center;
	}

	.sidebar-stats {
		padding: 15px 20px;
		border-top: 1px solid var(--border-color);
		background: var(--bg-color);
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 0;
		font-size: 14px;
	}

	.stat-icon {
		font-size: 18px;
		width: 24px;
	}

	.stat-text {
		color: var(--text-secondary);
		font-weight: 500;
	}

	.sidebar-close {
		position: absolute;
		top: 15px;
		right: 15px;
		width: 32px;
		height: 32px;
		border: none;
		background: rgba(255,255,255,0.2);
		color: white;
		border-radius: 50%;
		font-size: 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
	}

	.sidebar-close:hover {
		background: rgba(255,255,255,0.3);
	}

	@media (max-width: 768px) {
		.sidebar {
			display: flex;
		}
	}
</style>
