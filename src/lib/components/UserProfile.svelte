<script>
	import { githubUser, isGithubAuthenticated } from '$lib/stores/syncStore.js';
	import { signOut } from '$lib/services/githubAuth.js';
	import { resetSyncState } from '$lib/stores/syncStore.js';
	import SyncStatus from './SyncStatus.svelte';
	
	export let showMenu = false;
	
	function handleSignOut() {
		if (confirm('Sign out from GitHub? Your local progress will be preserved.')) {
			signOut();
			resetSyncState();
			showMenu = false;
		}
	}
</script>

{#if $isGithubAuthenticated && $githubUser}
	<div class="user-profile">
		<button class="profile-button" on:click={() => showMenu = !showMenu}>
			<img 
				src={$githubUser.avatar_url} 
				alt={$githubUser.login}
				class="avatar"
			/>
			<span class="username">{$githubUser.login}</span>
			<span class="dropdown-icon">▼</span>
		</button>
		
		{#if showMenu}
			<div class="profile-menu">
				<div class="menu-header">
					<img 
						src={$githubUser.avatar_url} 
						alt={$githubUser.login}
						class="avatar-large"
					/>
					<div>
						<div class="name">{$githubUser.name || $githubUser.login}</div>
						<div class="login">@{$githubUser.login}</div>
					</div>
				</div>
				
				<div class="menu-divider"></div>
				
				<div class="menu-item">
					<SyncStatus />
				</div>
				
				<div class="menu-divider"></div>
				
				<a href="/LingoVibe/settings" class="menu-item menu-link">
					⚙️ Settings
				</a>
				
				<button class="menu-item menu-button" on:click={handleSignOut}>
					🚪 Sign Out
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.user-profile {
		position: relative;
	}
	
	.profile-button {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		background-color: rgba(0, 0, 0, 0.05);
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 20px;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.profile-button:hover {
		background-color: rgba(0, 0, 0, 0.08);
		border-color: rgba(0, 0, 0, 0.15);
	}
	
	.avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
	}
	
	.username {
		font-size: 14px;
		font-weight: 500;
		color: #24292e;
	}
	
	.dropdown-icon {
		font-size: 10px;
		color: #656d76;
	}
	
	.profile-menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		min-width: 250px;
		background-color: white;
		border: 1px solid #d1d5da;
		border-radius: 8px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
		z-index: 100;
		overflow: hidden;
	}
	
	.menu-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
		background-color: #f6f8fa;
	}
	
	.avatar-large {
		width: 48px;
		height: 48px;
		border-radius: 50%;
	}
	
	.name {
		font-size: 14px;
		font-weight: 600;
		color: #24292e;
	}
	
	.login {
		font-size: 12px;
		color: #656d76;
	}
	
	.menu-divider {
		height: 1px;
		background-color: #e1e4e8;
	}
	
	.menu-item {
		padding: 12px 16px;
		display: block;
		width: 100%;
		text-align: left;
		border: none;
		background: none;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}
	
	.menu-link {
		text-decoration: none;
		color: #24292e;
		font-size: 14px;
	}
	
	.menu-button {
		color: #cf222e;
		font-size: 14px;
		font-weight: 500;
	}
	
	.menu-item:hover {
		background-color: #f6f8fa;
	}
</style>
