<script>
	/**
	 * Mobile hamburger menu button
	 * @component
	 */
	export let isOpen = false;
	export let onClick = () => {};
</script>

<button 
	class="mobile-menu-button" 
	on:click={onClick}
	aria-label={isOpen ? 'Close menu' : 'Open menu'}
	aria-expanded={isOpen}
>
	<span class="hamburger-icon" class:open={isOpen}>
		<span></span>
		<span></span>
		<span></span>
	</span>
</button>

<style>
	.mobile-menu-button {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		z-index: 1001;
	}

	.hamburger-icon {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 24px;
		height: 20px;
		position: relative;
	}

	.hamburger-icon span {
		display: block;
		width: 100%;
		height: 3px;
		background-color: var(--text-color);
		border-radius: 3px;
		transition: all 0.3s ease;
		transform-origin: center;
	}

	.hamburger-icon.open span:nth-child(1) {
		transform: translateY(8.5px) rotate(45deg);
	}

	.hamburger-icon.open span:nth-child(2) {
		opacity: 0;
	}

	.hamburger-icon.open span:nth-child(3) {
		transform: translateY(-8.5px) rotate(-45deg);
	}

	@media (max-width: 768px) {
		.mobile-menu-button {
			display: block;
		}
	}
</style>
