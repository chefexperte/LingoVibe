<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { 
		validateOAuthState, 
		exchangeCodeForToken, 
		setAccessToken, 
		fetchGithubUserInfo,
		setGithubUser
	} from '$lib/services/githubAuth.js';
	import { githubUser } from '$lib/stores/syncStore.js';
	import { performSync } from '$lib/stores/syncStore.js';
	
	let status = 'processing';
	let message = 'Authenticating with GitHub...';
	let error = null;
	
	onMount(async () => {
		try {
			// Get code and state from URL
			const code = $page.url.searchParams.get('code');
			const state = $page.url.searchParams.get('state');
			
			if (!code) {
				throw new Error('No authorization code received');
			}
			
			if (!state || !validateOAuthState(state)) {
				throw new Error('Invalid state parameter - possible CSRF attack');
			}
			
			// Exchange code for token
			message = 'Exchanging authorization code...';
			const token = await exchangeCodeForToken(code);
			
			if (!token) {
				throw new Error('Failed to get access token');
			}
			
			setAccessToken(token);
			
			// Fetch user info
			message = 'Fetching user information...';
			const userInfo = await fetchGithubUserInfo(token);
			setGithubUser(userInfo);
			githubUser.set(userInfo);
			
			// Perform initial sync
			message = 'Syncing your progress...';
			const syncResult = await performSync(false);
			
			if (syncResult.status === 'error') {
				console.warn('Initial sync failed, will retry later:', syncResult.message);
			}
			
			status = 'success';
			message = syncResult.message || 'Successfully signed in!';
			
			// Redirect to home after 2 seconds
			setTimeout(() => {
				goto(`${base}/`);
			}, 2000);
			
		} catch (err) {
			console.error('OAuth callback error:', err);
			status = 'error';
			error = err.message;
			message = 'Authentication failed';
			
			// Redirect to home after 3 seconds
			setTimeout(() => {
				goto(`${base}/`);
			}, 3000);
		}
	});
</script>

<svelte:head>
	<title>Authenticating... - LingoVibe</title>
</svelte:head>

<div class="callback-container">
	<div class="callback-card">
		{#if status === 'processing'}
			<div class="spinner"></div>
			<h1>Signing In</h1>
			<p>{message}</p>
		{:else if status === 'success'}
			<div class="success-icon">✓</div>
			<h1>Success!</h1>
			<p>{message}</p>
			<p class="redirect-text">Redirecting you to the app...</p>
		{:else if status === 'error'}
			<div class="error-icon">✗</div>
			<h1>Authentication Failed</h1>
			<p class="error-message">{error}</p>
			<p class="redirect-text">Redirecting you back...</p>
		{/if}
	</div>
</div>

<style>
	.callback-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
	
	.callback-card {
		background: white;
		border-radius: 12px;
		padding: 40px;
		max-width: 400px;
		width: 100%;
		text-align: center;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
	}
	
	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid #e1e4e8;
		border-top-color: #0969da;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 20px;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	.success-icon,
	.error-icon {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 20px;
		font-size: 32px;
		font-weight: bold;
	}
	
	.success-icon {
		background-color: #1a7f37;
		color: white;
	}
	
	.error-icon {
		background-color: #cf222e;
		color: white;
	}
	
	h1 {
		font-size: 24px;
		margin: 0 0 12px;
		color: #24292e;
	}
	
	p {
		margin: 8px 0;
		color: #656d76;
		font-size: 14px;
	}
	
	.error-message {
		color: #cf222e;
		font-weight: 500;
	}
	
	.redirect-text {
		margin-top: 20px;
		font-size: 12px;
		color: #8b949e;
	}
</style>
