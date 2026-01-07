<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { createAccount, markWelcomeScreenSeen } from '$lib/stores/userStore.js';
	import { onMount } from 'svelte';

	let username = '';
	let showAccountForm = false;
	let error = '';

	const features = [
		{ icon: '🎮', title: 'Gamified Learning', description: 'Earn XP, unlock achievements, and track your progress' },
		{ icon: '📖', title: 'Wiktionary Powered', description: 'Access comprehensive language data from Wiktionary' },
		{ icon: '❓', title: 'Interactive Quizzes', description: 'Test your knowledge with engaging quizzes' },
		{ icon: '📊', title: 'Progress Tracking', description: 'Monitor your learning journey with detailed statistics' }
	];

	function handleSkip() {
		markWelcomeScreenSeen();
		goto(`${base}/`);
	}

	function handleCreateAccount() {
		if (!username.trim()) {
			error = 'Please enter a username';
			return;
		}

		if (username.trim().length < 2) {
			error = 'Username must be at least 2 characters';
			return;
		}

		createAccount(username);
		markWelcomeScreenSeen();
		goto(`${base}/`);
	}

	function showForm() {
		showAccountForm = true;
	}

	onMount(() => {
		// Add entrance animation
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'auto';
		};
	});
</script>

<svelte:head>
	<title>Welcome to LingoVibe</title>
</svelte:head>

<div class="welcome-overlay">
	<div class="welcome-container">
		<div class="welcome-hero">
			<div class="welcome-logo">🌍</div>
			<h1>Welcome to LingoVibe</h1>
			<p class="tagline">Learn Languages with Joy</p>
			<p class="subtitle">Master new languages through gamified lessons and interactive practice</p>
		</div>

		<div class="features-grid">
			{#each features as feature}
				<div class="feature-item">
					<div class="feature-icon">{feature.icon}</div>
					<h3>{feature.title}</h3>
					<p>{feature.description}</p>
				</div>
			{/each}
		</div>

		{#if !showAccountForm}
			<div class="welcome-actions">
				<button class="btn btn-primary" on:click={showForm}>
					Create Account
				</button>
				<button class="btn btn-secondary" on:click={handleSkip}>
					Skip for Now
				</button>
			</div>
		{:else}
			<div class="account-form">
				<h2>Create Your Account</h2>
				<p class="form-description">Choose a username to get started</p>
				
				{#if error}
					<div class="error-message">{error}</div>
				{/if}

				<input
					type="text"
					bind:value={username}
					placeholder="Enter username"
					maxlength="20"
					class="username-input"
					on:input={() => error = ''}
				/>

				<div class="form-actions">
					<button class="btn btn-primary" on:click={handleCreateAccount}>
						Start Learning
					</button>
					<button class="btn btn-secondary" on:click={handleSkip}>
						Skip
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.welcome-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
		z-index: 1000;
		overflow-y: auto;
		animation: fadeIn 0.5s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.welcome-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 40px 20px;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.welcome-hero {
		text-align: center;
		color: white;
		margin-bottom: 40px;
		animation: slideDown 0.8s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.welcome-logo {
		font-size: 80px;
		margin-bottom: 20px;
		animation: bounce 1s ease-in-out;
	}

	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	.welcome-hero h1 {
		font-size: 48px;
		margin-bottom: 10px;
		font-weight: bold;
	}

	.tagline {
		font-size: 24px;
		margin-bottom: 10px;
		font-weight: 600;
	}

	.subtitle {
		font-size: 18px;
		opacity: 0.9;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
		margin-bottom: 40px;
		animation: fadeInUp 1s ease-out 0.3s both;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.feature-item {
		background: rgba(255, 255, 255, 0.95);
		padding: 25px;
		border-radius: var(--radius);
		text-align: center;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
	}

	.feature-item:hover {
		transform: translateY(-5px);
	}

	.feature-icon {
		font-size: 48px;
		margin-bottom: 15px;
	}

	.feature-item h3 {
		font-size: 18px;
		margin-bottom: 10px;
		color: var(--text-color);
	}

	.feature-item p {
		font-size: 14px;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.welcome-actions {
		display: flex;
		gap: 15px;
		justify-content: center;
		animation: fadeInUp 1s ease-out 0.5s both;
	}

	.account-form {
		background: white;
		padding: 40px;
		border-radius: var(--radius);
		max-width: 500px;
		margin: 0 auto;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		animation: fadeInUp 1s ease-out 0.5s both;
	}

	.account-form h2 {
		margin-bottom: 10px;
		text-align: center;
		color: var(--text-color);
	}

	.form-description {
		text-align: center;
		color: var(--text-secondary);
		margin-bottom: 25px;
	}

	.username-input {
		width: 100%;
		padding: 15px;
		font-size: 16px;
		border: 2px solid var(--border-color);
		border-radius: var(--radius);
		margin-bottom: 20px;
		transition: border-color 0.2s;
	}

	.username-input:focus {
		outline: none;
		border-color: var(--primary-color);
	}

	.error-message {
		background: #ffe0e0;
		color: var(--danger-color);
		padding: 10px;
		border-radius: 8px;
		margin-bottom: 15px;
		text-align: center;
		font-size: 14px;
	}

	.form-actions {
		display: flex;
		gap: 10px;
		justify-content: center;
	}

	.btn {
		padding: 15px 30px;
		font-size: 16px;
		font-weight: 600;
		border: none;
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: var(--primary-color);
		color: white;
	}

	.btn-primary:hover {
		background: #4bb602;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(88, 204, 2, 0.3);
	}

	.btn-secondary {
		background: white;
		color: var(--text-color);
		border: 2px solid var(--border-color);
	}

	.btn-secondary:hover {
		border-color: var(--text-color);
		transform: translateY(-2px);
	}

	@media (max-width: 768px) {
		.welcome-container {
			padding: 20px 15px;
		}

		.welcome-logo {
			font-size: 60px;
		}

		.welcome-hero h1 {
			font-size: 32px;
		}

		.tagline {
			font-size: 20px;
		}

		.subtitle {
			font-size: 16px;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.welcome-actions,
		.form-actions {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}

		.account-form {
			padding: 30px 20px;
		}
	}
</style>
