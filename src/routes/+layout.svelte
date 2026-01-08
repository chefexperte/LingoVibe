<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { user, logout } from '$lib/stores/userStore.js';
	import { totalXP } from '$lib/stores/lessonStore.js';
	import { isGithubAuthenticated } from '$lib/stores/syncStore.js';
	import { initAchievementStore } from '$lib/stores/achievementStore.js';
	import { initVocabularyStore } from '$lib/stores/vocabularyStore.js';
	import LoginButton from '$lib/components/LoginButton.svelte';
	import UserProfile from '$lib/components/UserProfile.svelte';
	import SyncStatus from '$lib/components/SyncStatus.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import AchievementPopup from '$lib/components/AchievementPopup.svelte';
	import '../app.css';
	
	let showUserMenu = false;
	let showGithubMenu = false;
	let showMobileSidebar = false;
	
	onMount(() => {
		initAchievementStore();
		initVocabularyStore();
	});
	
	function handleLogout() {
		if (confirm('Are you sure you want to log out? Your progress will be saved.')) {
			logout();
			showUserMenu = false;
		}
	}
	
	function toggleMobileSidebar() {
		showMobileSidebar = !showMobileSidebar;
	}
	
	function closeMobileSidebar() {
		showMobileSidebar = false;
	}
</script>

<svelte:head>
	<title>LingoVibe - Learn Languages with Joy</title>
</svelte:head>

<header>
	<div class="container">
		<div class="header-left">
			<MobileMenu isOpen={showMobileSidebar} onClick={toggleMobileSidebar} />
			<a href="{base}/" class="logo">
				<span>🌍</span>
				<span>LingoVibe</span>
			</a>
		</div>
		<nav class="desktop-nav">
			<a href="{base}/" class:active={$page.url.pathname === `${base}/`}>Home</a>
			<a href="{base}/courses" class:active={$page.url.pathname.startsWith(`${base}/courses`)}>Courses</a>
			<a href="{base}/practice" class:active={$page.url.pathname === `${base}/practice`}>Practice</a>
			<a href="{base}/vocabulary" class:active={$page.url.pathname === `${base}/vocabulary`}>Vocabulary</a>
			<a href="{base}/achievements" class:active={$page.url.pathname === `${base}/achievements`}>Achievements</a>
			
			{#if $isGithubAuthenticated}
				<UserProfile bind:showMenu={showGithubMenu} />
			{:else if $user}
				<!-- Show regular user menu if logged in locally but not with GitHub -->
				<div class="user-info">
					<button class="user-button" on:click={() => showUserMenu = !showUserMenu}>
						<span class="user-icon">👤</span>
						<span class="username">{$user.username}</span>
						<span class="user-xp">{$totalXP} XP</span>
					</button>
					{#if showUserMenu}
						<div class="user-menu">
							<div class="user-menu-item user-stats">
								<div>Username: {$user.username}</div>
								<div>Total XP: {$totalXP}</div>
							</div>
							<button class="user-menu-item logout-btn" on:click={handleLogout}>
								Log Out
							</button>
						</div>
					{/if}
				</div>
			{/if}
			
			{#if !$isGithubAuthenticated}
				<div class="github-login">
					<LoginButton variant="secondary" />
				</div>
			{/if}
			
			{#if $isGithubAuthenticated}
				<div class="sync-status-nav">
					<SyncStatus />
				</div>
			{/if}
		</nav>
		<div class="mobile-user-section">
			{#if $isGithubAuthenticated}
				<div class="sync-status-mobile">
					<SyncStatus />
				</div>
			{:else if $user}
				<div class="user-xp-mobile">{$totalXP} XP</div>
			{/if}
		</div>
	</div>
</header>

<Sidebar isOpen={showMobileSidebar} onClose={closeMobileSidebar} />

<main>
	<slot />
</main>

<!-- Global Achievement Popup -->
<AchievementPopup />

<footer>
	<div class="container">
		<p>LingoVibe © 2026 | Open Source (<a href="https://github.com/chefexperte/LingoVibe/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>) | <a href="https://github.com/chefexperte/LingoVibe" target="_blank" rel="noopener noreferrer">GitHub</a></p>
	</div>
</footer>
