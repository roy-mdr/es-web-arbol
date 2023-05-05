<script lang="ts">
	import { Search } from 'lucide-svelte';

	import { activityLibFilterTerm } from '$lib/stores/activityLib';
	import { iconSize } from '$lib/stores/appConstants';

	let filTerm = '';

	$: activityLibFilterTerm.set(filTerm);
</script>

<div class="filter">
	<div class="search">
		<div class="icon">
			<Search size={iconSize} />
		</div>
		<input bind:value={filTerm} type="text" id="searchInput" placeholder="Filter..." />
	</div>
</div>

<style>
	.filter .search {
		padding: var(--space-half);
		border-radius: var(--radius-cont);
		background-color: var(--background);
		box-shadow: inset var(--shadow-default);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.filter .search .icon {
		margin-right: var(--space-half);
	}

	.filter .search input {
		border: none;
		background-color: transparent;
		width: 100%;
	}
</style>
