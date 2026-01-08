<script>
	import { base } from '$app/paths';
	import { LANGUAGES } from '$lib/utils/constants.js';
	import { lessonProgress } from '$lib/stores/lessonStore.js';
	import { getAllLessons } from '$lib/lessons/russian.js';

	$: availableCourses = LANGUAGES.filter(lang => lang.status === 'available');
	$: comingSoonCourses = LANGUAGES.filter(lang => lang.status === 'coming-soon');

	function getCourseProgress(langCode) {
		if (langCode === 'ru') {
			const completed = $lessonProgress['ru']?.length || 0;
			const total = getAllLessons().length;
			return { completed, total, percent: Math.round((completed / total) * 100) };
		}
		return { completed: 0, total: 0, percent: 0 };
	}
</script>

<svelte:head>
	<title>Courses - LingoVibe</title>
</svelte:head>

<div class="courses-container">
	<div class="courses-header">
		<h1>Language Courses</h1>
		<p>Choose a course to start your learning journey</p>
	</div>

	<!-- Available Courses -->
	<section class="courses-section">
		<h2>Available Courses</h2>
		<div class="courses-grid">
			{#each availableCourses as course}
				{@const progress = getCourseProgress(course.code)}
				<a href="{base}/courses/{course.code}" class="course-card">
					<div class="course-flag">{course.flag}</div>
					<div class="course-info">
						<h3>{course.name}</h3>
						<p class="course-description">{course.description}</p>
						
						{#if progress.total > 0}
							<div class="course-progress">
								<div class="progress-text">
									<span>{progress.completed} / {progress.total} Lessons</span>
									<span class="progress-percent">{progress.percent}%</span>
								</div>
								<div class="progress-bar">
									<div class="progress-fill" style="width: {progress.percent}%"></div>
								</div>
							</div>
						{/if}

						<div class="course-action">
							{#if progress.completed > 0}
								<span class="btn-text">Continue Course →</span>
							{:else}
								<span class="btn-text">Start Course →</span>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Coming Soon Courses -->
	{#if comingSoonCourses.length > 0}
		<section class="courses-section coming-soon-section">
			<h2>Coming Soon</h2>
			<div class="courses-grid">
				{#each comingSoonCourses as course}
					<div class="course-card locked">
						<div class="course-flag grayscale">{course.flag}</div>
						<div class="course-info">
							<h3>{course.name}</h3>
							<p class="course-description">{course.description}</p>
							<span class="badge badge-warning">Coming Soon</span>
						</div>
						<div class="lock-overlay">🔒</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.courses-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.courses-header {
		text-align: center;
		margin-bottom: 40px;
	}

	.courses-header h1 {
		font-size: 36px;
		margin-bottom: 10px;
	}

	.courses-header p {
		font-size: 18px;
		color: var(--text-secondary);
	}

	.courses-section {
		margin-bottom: 50px;
	}

	.courses-section h2 {
		font-size: 24px;
		margin-bottom: 20px;
		color: var(--text-color);
	}

	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}

	.course-card {
		background: var(--card-bg);
		border-radius: var(--radius);
		padding: 25px;
		box-shadow: var(--shadow);
		transition: transform 0.2s, box-shadow 0.2s;
		text-decoration: none;
		color: var(--text-color);
		display: block;
		position: relative;
	}

	.course-card:not(.locked):hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
	}

	.course-card.locked {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.course-flag {
		font-size: 64px;
		text-align: center;
		margin-bottom: 15px;
	}

	.course-flag.grayscale {
		filter: grayscale(100%);
	}

	.course-info h3 {
		font-size: 24px;
		margin-bottom: 10px;
		text-align: center;
	}

	.course-description {
		font-size: 14px;
		color: var(--text-secondary);
		text-align: center;
		margin-bottom: 15px;
	}

	.course-progress {
		margin: 20px 0;
	}

	.progress-text {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		margin-bottom: 8px;
		color: var(--text-secondary);
	}

	.progress-percent {
		font-weight: 600;
		color: var(--primary-color);
	}

	.progress-bar {
		background: var(--bg-secondary);
		border-radius: 10px;
		height: 8px;
		overflow: hidden;
	}

	.progress-fill {
		background: var(--primary-gradient);
		height: 100%;
		border-radius: 10px;
		transition: width 0.3s ease;
	}

	.course-action {
		text-align: center;
		margin-top: 15px;
	}

	.btn-text {
		color: var(--primary-color);
		font-weight: 600;
		font-size: 16px;
	}

	.lock-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 48px;
		opacity: 0.3;
	}

	.badge {
		display: inline-block;
		padding: 6px 12px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
	}

	.badge-warning {
		background: #fbbf24;
		color: #78350f;
	}

	@media (max-width: 768px) {
		.courses-grid {
			grid-template-columns: 1fr;
		}

		.courses-header h1 {
			font-size: 28px;
		}
	}
</style>
