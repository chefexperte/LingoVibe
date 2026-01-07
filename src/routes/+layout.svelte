<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import '../app.css';
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
