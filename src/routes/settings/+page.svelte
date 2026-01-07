<script>
	import { base } from '$app/paths';
	import { 
		githubUser, 
		isGithubAuthenticated, 
		syncStatus, 
		lastSync,
		syncCount,
		syncError,
		manualSync
	} from '$lib/stores/syncStore.js';
	import { user } from '$lib/stores/userStore.js';
	import { lessonProgress, totalXP, streak } from '$lib/stores/lessonStore.js';
	import { signOut } from '$lib/services/githubAuth.js';
	import { resetSyncState } from '$lib/stores/syncStore.js';
	import { deleteGist, createGistData } from '$lib/services/gistSync.js';
	import LoginButton from '$lib/components/LoginButton.svelte';
	import SyncStatus from '$lib/components/SyncStatus.svelte';
	
	let syncing = false;
	let syncMessage = '';
	let deleting = false;
	
	async function handleManualSync() {
		syncing = true;
		syncMessage = '';
		try {
			const result = await manualSync();
			syncMessage = result.message || 'Sync completed';
		} catch (error) {
			syncMessage = `Sync failed: ${error.message}`;
		} finally {
			syncing = false;
		}
	}
	
	async function handleDownloadProgress() {
		const data = createGistData(
			$user,
			$lessonProgress,
			$totalXP,
			$streak,
			null
		);
		
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `lingovibe-progress-${new Date().toISOString().split('T')[0]}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	
	async function handleDeleteCloudData() {
		if (!confirm('Are you sure you want to delete your cloud backup? This cannot be undone. Your local data will be preserved.')) {
			return;
		}
		
		deleting = true;
		try {
			await deleteGist();
			alert('Cloud backup deleted successfully');
		} catch (error) {
			alert(`Failed to delete cloud backup: ${error.message}`);
		} finally {
			deleting = false;
		}
	}
	
	function handleSignOut() {
		if (confirm('Sign out from GitHub? Your local progress will be preserved.')) {
			signOut();
			resetSyncState();
		}
	}
	
	function formatDate(timestamp) {
		if (!timestamp) return 'Never';
		return new Date(timestamp).toLocaleString();
	}
</script>

<svelte:head>
	<title>Settings - LingoVibe</title>
</svelte:head>

<div class="settings-container">
	<div class="settings-header">
		<a href="{base}/" class="back-link">← Back to Home</a>
		<h1>Settings</h1>
	</div>
	
	<div class="settings-content">
		<!-- GitHub Sync Section -->
		<section class="settings-section">
			<h2>🔄 Cloud Sync</h2>
			<p class="section-description">
				Sync your progress across devices using GitHub Gists
			</p>
			
			{#if $isGithubAuthenticated && $githubUser}
				<div class="github-account">
					<img 
						src={$githubUser.avatar_url} 
						alt={$githubUser.login}
						class="account-avatar"
					/>
					<div class="account-info">
						<div class="account-name">{$githubUser.name || $githubUser.login}</div>
						<div class="account-login">@{$githubUser.login}</div>
					</div>
					<SyncStatus />
				</div>
				
				<div class="sync-stats">
					<div class="stat">
						<div class="stat-label">Last Synced</div>
						<div class="stat-value">{formatDate($lastSync)}</div>
					</div>
					<div class="stat">
						<div class="stat-label">Total Syncs</div>
						<div class="stat-value">{$syncCount}</div>
					</div>
					<div class="stat">
						<div class="stat-label">Status</div>
						<div class="stat-value">{$syncStatus}</div>
					</div>
				</div>
				
				{#if $syncError}
					<div class="error-message">
						<strong>Last Error:</strong> {$syncError}
					</div>
				{/if}
				
				{#if syncMessage}
					<div class="sync-message">
						{syncMessage}
					</div>
				{/if}
				
				<div class="settings-actions">
					<button 
						class="btn btn-primary"
						on:click={handleManualSync}
						disabled={syncing || $syncStatus === 'syncing'}
					>
						{syncing ? 'Syncing...' : '🔄 Sync Now'}
					</button>
					
					<button 
						class="btn btn-secondary"
						on:click={handleDownloadProgress}
					>
						📥 Download Progress
					</button>
					
					<button 
						class="btn btn-danger"
						on:click={handleDeleteCloudData}
						disabled={deleting}
					>
						{deleting ? 'Deleting...' : '🗑️ Delete Cloud Backup'}
					</button>
				</div>
				
				<div class="settings-actions">
					<button 
						class="btn btn-outline"
						on:click={handleSignOut}
					>
						🚪 Sign Out
					</button>
				</div>
			{:else}
				<div class="not-signed-in">
					<p>Sign in with GitHub to enable cloud sync</p>
					<LoginButton />
				</div>
			{/if}
		</section>
		
		<!-- User Info Section -->
		{#if $user}
			<section class="settings-section">
				<h2>👤 Account</h2>
				<div class="user-info">
					<div class="info-row">
						<span class="info-label">Username:</span>
						<span class="info-value">{$user.username}</span>
					</div>
					<div class="info-row">
						<span class="info-label">Member Since:</span>
						<span class="info-value">{new Date($user.createdAt).toLocaleDateString()}</span>
					</div>
					<div class="info-row">
						<span class="info-label">Total XP:</span>
						<span class="info-value">{$totalXP}</span>
					</div>
					<div class="info-row">
						<span class="info-label">Current Streak:</span>
						<span class="info-value">{$streak} days</span>
					</div>
				</div>
			</section>
		{/if}
		
		<!-- About Section -->
		<section class="settings-section">
			<h2>ℹ️ About</h2>
			<p class="about-text">
				LingoVibe uses GitHub Gists to securely store your learning progress in the cloud.
				Your data is stored in a private Gist associated with your GitHub account.
			</p>
			<p class="about-text">
				To revoke access, visit: 
				<a href="https://github.com/settings/applications" target="_blank" rel="noopener noreferrer">
					GitHub Settings → Applications
				</a>
			</p>
		</section>
	</div>
</div>

<style>
	.settings-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 40px 20px;
	}
	
	.settings-header {
		margin-bottom: 40px;
	}
	
	.back-link {
		display: inline-block;
		color: #0969da;
		text-decoration: none;
		margin-bottom: 16px;
		font-size: 14px;
	}
	
	.back-link:hover {
		text-decoration: underline;
	}
	
	h1 {
		font-size: 32px;
		margin: 0;
		color: #24292e;
	}
	
	.settings-content {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}
	
	.settings-section {
		background: white;
		border: 1px solid #d1d5da;
		border-radius: 8px;
		padding: 24px;
	}
	
	h2 {
		font-size: 20px;
		margin: 0 0 8px;
		color: #24292e;
	}
	
	.section-description {
		margin: 0 0 20px;
		color: #656d76;
		font-size: 14px;
	}
	
	.github-account {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px;
		background-color: #f6f8fa;
		border-radius: 6px;
		margin-bottom: 20px;
	}
	
	.account-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
	}
	
	.account-info {
		flex: 1;
	}
	
	.account-name {
		font-size: 16px;
		font-weight: 600;
		color: #24292e;
	}
	
	.account-login {
		font-size: 14px;
		color: #656d76;
	}
	
	.sync-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 16px;
		margin-bottom: 20px;
	}
	
	.stat {
		padding: 12px;
		background-color: #f6f8fa;
		border-radius: 6px;
	}
	
	.stat-label {
		font-size: 12px;
		color: #656d76;
		margin-bottom: 4px;
	}
	
	.stat-value {
		font-size: 16px;
		font-weight: 600;
		color: #24292e;
	}
	
	.error-message {
		padding: 12px;
		background-color: #fff1f0;
		border: 1px solid #ffccc7;
		border-radius: 6px;
		color: #cf222e;
		font-size: 14px;
		margin-bottom: 16px;
	}
	
	.sync-message {
		padding: 12px;
		background-color: #dafbe1;
		border: 1px solid #34d058;
		border-radius: 6px;
		color: #1a7f37;
		font-size: 14px;
		margin-bottom: 16px;
	}
	
	.settings-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 16px;
	}
	
	.btn {
		padding: 10px 20px;
		border: none;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	.btn-primary {
		background-color: #0969da;
		color: white;
	}
	
	.btn-primary:hover:not(:disabled) {
		background-color: #0860ca;
	}
	
	.btn-secondary {
		background-color: #f6f8fa;
		color: #24292e;
		border: 1px solid #d1d5da;
	}
	
	.btn-secondary:hover:not(:disabled) {
		background-color: #f3f4f6;
		border-color: #b1b8c0;
	}
	
	.btn-danger {
		background-color: #cf222e;
		color: white;
	}
	
	.btn-danger:hover:not(:disabled) {
		background-color: #b02027;
	}
	
	.btn-outline {
		background-color: white;
		color: #24292e;
		border: 1px solid #d1d5da;
	}
	
	.btn-outline:hover {
		background-color: #f6f8fa;
	}
	
	.not-signed-in {
		text-align: center;
		padding: 40px;
	}
	
	.not-signed-in p {
		margin-bottom: 20px;
		color: #656d76;
	}
	
	.user-info {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	
	.info-row {
		display: flex;
		justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid #e1e4e8;
	}
	
	.info-label {
		color: #656d76;
		font-size: 14px;
	}
	
	.info-value {
		color: #24292e;
		font-weight: 500;
		font-size: 14px;
	}
	
	.about-text {
		margin: 12px 0;
		color: #656d76;
		font-size: 14px;
		line-height: 1.6;
	}
	
	.about-text a {
		color: #0969da;
		text-decoration: none;
	}
	
	.about-text a:hover {
		text-decoration: underline;
	}
</style>
