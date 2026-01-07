<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { user, logout } from '$lib/stores/userStore.js';
	import { totalXP } from '$lib/stores/lessonStore.js';
	import '../app.css';
	
	let showUserMenu = false;
	
	function handleLogout() {
		if (confirm('Are you sure you want to log out? Your progress will be saved.')) {
			logout();
			showUserMenu = false;
		}
	}
</script>

<svelte:head>
	<title>LingoVibe - Learn Languages with Joy</title>
</svelte:head>

<header>
	<div class="container">
		<a href="{base}/" class="logo">
			<span>🌍</span>
			<span>LingoVibe</span>
		</a>
		<nav>
			<a href="{base}/" class:active={$page.url.pathname === `${base}/`}>Home</a>
			<a href="{base}/learn" class:active={$page.url.pathname.startsWith(`${base}/learn`)}>Learn</a>
			<a href="{base}/practice" class:active={$page.url.pathname === `${base}/practice`}>Practice</a>
			
			{#if $user}
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
		</nav>
	</div>
</header>

<main>
	<slot />
</main>

<footer>
	<div class="container">
		<p>&copy; 2026 LingoVibe. All rights reserved.</p>
	</div>
</footer>
