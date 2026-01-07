<script>
	/**
	 * Mobile sidebar navigation
	 * @component
	 */
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	
	export let isOpen = false;
	export let onClose = () => {};
	
	const navItems = [
		{ path: '/', label: 'Home', icon: '🏠' },
		{ path: '/learn', label: 'Learn', icon: '📚' },
		{ path: '/practice', label: 'Practice', icon: '✍️' },
		{ path: '/settings', label: 'Settings', icon: '⚙️' }
	];
	
	function handleNavClick() {
		onClose();
	}
	
	function handleOverlayClick() {
		onClose();
	}
	
	$: isActive = (path) => {
		if (path === '/') {
			return $page.url.pathname === `${base}/` || $page.url.pathname === `${base}`;
		}
		return $page.url.pathname.startsWith(`${base}${path}`);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if isOpen}
	<div class="sidebar-overlay" on:click={handleOverlayClick}></div>
{/if}

<aside class="sidebar" class:open={isOpen}>
	<div class="sidebar-header">
		<button class="close-button" on:click={onClose} aria-label="Close menu">
			<span>✕</span>
		</button>
		<h2>Menu</h2>
	</div>
	
	<nav class="sidebar-nav">
		{#each navItems as item}
			<a 
				href="{base}{item.path}" 
				class="sidebar-link" 
				class:active={isActive(item.path)}
				on:click={handleNavClick}
			>
				<span class="nav-icon">{item.icon}</span>
				<span class="nav-label">{item.label}</span>
			</a>
		{/each}
	</nav>
</aside>

<style>
	.sidebar-overlay {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
		animation: fadeIn 0.3s ease;
	}

	.sidebar {
		display: none;
		position: fixed;
		top: 0;
		left: -300px;
		width: 280px;
		height: 100vh;
		background: var(--card-bg);
		box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		transition: left 0.3s ease;
		overflow-y: auto;
	}

	.sidebar.open {
		left: 0;
	}

	.sidebar-header {
		padding: 20px;
		border-bottom: 1px solid var(--border-color);
		display: flex;
		align-items: center;
		gap: 15px;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
		color: var(--text-color);
		padding: 4px 8px;
		line-height: 1;
		transition: color 0.2s;
	}

	.close-button:hover {
		color: var(--danger-color);
	}

	.sidebar-header h2 {
		margin: 0;
		font-size: 20px;
		color: var(--text-color);
	}

	.sidebar-nav {
		padding: 10px 0;
	}

	.sidebar-link {
		display: flex;
		align-items: center;
		gap: 15px;
		padding: 16px 20px;
		color: var(--text-color);
		text-decoration: none;
		transition: background-color 0.2s;
		font-weight: 500;
	}

	.sidebar-link:hover {
		background-color: var(--bg-color);
	}

	.sidebar-link.active {
		background-color: var(--primary-color);
		color: white;
	}

	.nav-icon {
		font-size: 20px;
		width: 24px;
		text-align: center;
	}

	.nav-label {
		font-size: 16px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.sidebar-overlay {
			display: block;
		}

		.sidebar {
			display: block;
		}
	}
</style>
