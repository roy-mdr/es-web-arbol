<script lang="ts">
	import { slide } from 'svelte/transition';
	import ZoneSortable from '$lib/components/ZoneSortable.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, selectedId } from '$lib/stores/appState';

	export let id: App.Zone['id'];
	export let name: App.Zone['name'];
	export let children: App.Zone['children'];
	export let isMainTree = false;
	export let route: App.Zone['route'];
	export let isOpen: App.Zone['open'] = true;

	function toggleOpen() {
		mainTree.toggleOpenZone(route);
	}

	function toggleSelect() {
		if ($selectedId == id) {
			selectedId.set('');
		} else {
			selectedId.set(id);
		}
	}
</script>

<div {id} class="zone" class:selected={$selectedId == id}>
	<div class="header">
		{#if !isMainTree}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="arrow" class:open={isOpen} on:click={toggleOpen}>►</div>
		{/if}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="title"
			class:handle={!isMainTree}
			class:handle-copy={!isMainTree && $ctrlKeyIsDown}
			on:click={toggleSelect}
		>
			{name}
		</div>
	</div>
	<!-- Set transition in this div -->
	{#if isOpen}
		<div transition:slide|local={{ duration: 200 }}>
			<ZoneSortable {route} content={children} />
		</div>
	{/if}
</div>

<style>
	.zone {
		padding: 0.5em;
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 2px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
		margin: 0.5em;
	}

	.zone :global(.header) {
		display: flex;
	}

	.zone :global(.title) {
		font-weight: bold;
		background-color: rgba(0, 0, 0, 0.1);
		width: max-content;
		padding: 0 0.5em;
		border-radius: 2px;
	}

	.zone :global(.handle) {
		cursor: grab;
	}

	.zone :global(.handle.handle-copy) {
		cursor: copy;
	}

	.zone :global(.z-content) {
		margin: 0.5em;
		border-radius: 2px;
		border: 1px dashed rgba(0, 0, 0, 0.25);
		min-height: 2em;
	}

	.zone :global(.arrow) {
		margin-right: 0.5em;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.zone :global(.arrow.open) {
		transform: rotate(90deg);
	}

	.selected {
		border: 1px solid #ff3e00;
	}
</style>
