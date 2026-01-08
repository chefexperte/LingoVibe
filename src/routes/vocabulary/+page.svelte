<script>
import { onMount } from 'svelte';
import {
vocabulary,
learnedWords,
masteredWords,
wordsInProgress,
vocabularyStats,
initVocabularyStore
} from '$lib/stores/vocabularyStore.js';
import { base } from '$app/paths';
import WordDetailCard from '$lib/components/WordDetailCard.svelte';

onMount(() => {
initVocabularyStore();
});

let filter = 'all'; // 'all' | 'mastered' | 'in-progress'
let sortBy = 'proficiency'; // 'proficiency' | 'alphabetical' | 'recent'

$: displayWords = (() => {
let words;
if (filter === 'mastered') {
words = $masteredWords;
} else if (filter === 'in-progress') {
words = $wordsInProgress;
} else {
words = $learnedWords;
}

// Apply sorting
if (sortBy === 'alphabetical') {
return [...words].sort((a, b) => a.word.localeCompare(b.word));
} else if (sortBy === 'recent') {
return [...words].sort(
(a, b) => new Date(b.lastPracticed) - new Date(a.lastPracticed)
);
}

return words; // already sorted by proficiency
})();
</script>

<div class="vocabulary-page">
<div class="vocabulary-header">
<h1>📚 My Vocabulary</h1>
<p>Track your learned words and proficiency</p>
</div>

<!-- Statistics Cards -->
<div class="vocab-stats">
<div class="stat-card">
<div class="stat-number">{$vocabularyStats.total}</div>
<div class="stat-label">Total Words</div>
</div>
<div class="stat-card mastered">
<div class="stat-number">{$vocabularyStats.mastered}</div>
<div class="stat-label">Mastered</div>
<div class="stat-icon">✅</div>
</div>
<div class="stat-card in-progress">
<div class="stat-number">{$vocabularyStats.inProgress}</div>
<div class="stat-label">In Progress</div>
<div class="stat-icon">📝</div>
</div>
<div class="stat-card avg">
<div class="stat-number">{$vocabularyStats.avgProficiency}%</div>
<div class="stat-label">Avg Proficiency</div>
</div>
</div>

<!-- Filters and Sort -->
<div class="vocabulary-controls">
<div class="filter-group">
<label>Filter:</label>
<div class="filter-buttons">
<button
class="filter-btn {filter === 'all' ? 'active' : ''}"
on:click={() => (filter = 'all')}
>
All Words
</button>
<button
class="filter-btn {filter === 'mastered' ? 'active' : ''}"
on:click={() => (filter = 'mastered')}
>
Mastered ✅
</button>
<button
class="filter-btn {filter === 'in-progress' ? 'active' : ''}"
on:click={() => (filter = 'in-progress')}
>
In Progress
</button>
</div>
</div>

<div class="sort-group">
<label for="sort-select">Sort by:</label>
<select id="sort-select" bind:value={sortBy}>
<option value="proficiency">Proficiency</option>
<option value="alphabetical">Alphabetical</option>
<option value="recent">Recently Practiced</option>
</select>
</div>
</div>

<!-- Words List -->
{#if displayWords.length === 0}
<div class="empty-state">
<div class="empty-icon">📖</div>
<h3>No words yet!</h3>
<p>Complete lessons and quizzes to start building your vocabulary.</p>
<a href="{base}/practice" class="btn btn-primary">Start Practicing →</a>
</div>
{:else}
<div class="words-grid">
{#each displayWords as word (word.word)}
<WordDetailCard wordData={word} />
{/each}
</div>
{/if}
</div>

<style>
.vocabulary-page {
max-width: 1200px;
margin: 0 auto;
padding: 20px;
}

.vocabulary-header {
text-align: center;
margin-bottom: 30px;
}

.vocabulary-header h1 {
font-size: 36px;
margin-bottom: 10px;
}

.vocab-stats {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 20px;
margin-bottom: 30px;
}

.stat-card {
background: var(--card-bg);
padding: 20px;
border-radius: var(--radius);
box-shadow: var(--shadow);
text-align: center;
position: relative;
}

.stat-card.mastered {
border: 2px solid var(--primary-color);
}

.stat-card.in-progress {
border: 2px solid var(--warning-color);
}

.stat-number {
font-size: 36px;
font-weight: 700;
color: var(--primary-color);
margin-bottom: 5px;
}

.stat-label {
font-size: 14px;
color: var(--text-secondary);
}

.stat-icon {
position: absolute;
top: 10px;
right: 10px;
font-size: 24px;
opacity: 0.3;
}

.vocabulary-controls {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 30px;
flex-wrap: wrap;
gap: 20px;
}

.filter-group,
.sort-group {
display: flex;
align-items: center;
gap: 10px;
}

.filter-buttons {
display: flex;
gap: 10px;
}

.filter-btn {
padding: 8px 16px;
border: 2px solid var(--border-color);
background: white;
border-radius: 20px;
cursor: pointer;
transition: all 0.2s;
}

.filter-btn.active {
background: var(--primary-color);
color: white;
border-color: var(--primary-color);
}

.filter-btn:hover {
border-color: var(--primary-color);
}

.sort-group select {
padding: 8px 12px;
border: 2px solid var(--border-color);
border-radius: 8px;
background: white;
cursor: pointer;
}

.words-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
gap: 20px;
}

.empty-state {
text-align: center;
padding: 60px 20px;
background: var(--card-bg);
border-radius: var(--radius);
box-shadow: var(--shadow);
}

.empty-icon {
font-size: 64px;
margin-bottom: 20px;
}

.empty-state h3 {
font-size: 24px;
margin-bottom: 10px;
}

.empty-state p {
color: var(--text-secondary);
margin-bottom: 20px;
}

@media (max-width: 768px) {
.vocabulary-controls {
flex-direction: column;
align-items: stretch;
}

.filter-buttons {
flex-direction: column;
}

.words-grid {
grid-template-columns: 1fr;
}
}
</style>
