<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import Activity from './Activity.svelte';

	onMount(() => {
		setupSortable();
	});

	export let name: string;
	export let children: any[];
	export let fixed = false;

	let zoneSortEl: HTMLElement;

	function setupSortable() {
		Sortable.create(zoneSortEl, {
			group: 'zone',
			animation: 150,
			handle: '.handle',
			fallbackOnBody: true,
			invertSwap: true
		});
	}
</script>

<div class="zone">
	<div class="title" class:handle={!fixed}>{name}</div>
	<div class="z-content" bind:this={zoneSortEl}>
		{#each children as child}
			{#if child.type == 'zone'}
				<svelte:self {...child} />
			{:else if child.type == 'act'}
				<Activity name={child.name} />
			{/if}
		{/each}
	</div>
</div>

<style>
	.zone {
		padding: 0.5em;
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 2px;
		box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25);
		margin: 0.5em;
	}

	.title {
		font-weight: bold;
		background-color: rgba(0, 0, 0, 0.1);
		width: max-content;
		padding: 0 0.5em;
		border-radius: 2px;
	}

	.handle {
		cursor: grab;
	}

	.z-content {
		margin: 0.5em;
		border-radius: 2px;
		border: 1px dashed rgba(0, 0, 0, 0.25);
		min-height: 2em;
	}
</style>
