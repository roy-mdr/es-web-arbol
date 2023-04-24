<script lang="ts">
	import ZoneSortable from '$lib/components/ZoneSortable.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown } from '$lib/stores/appState';

	export let id: App.Zone['id'];
	export let name: App.Zone['name'];
	export let children: App.Zone['children'];
	export let isMainTree = false;
	export let route: App.Zone['route'];
	export let isOpen: App.Zone['open'];

	function toggleOpen() {
		mainTree.toggleOpenZone(route);
	}
</script>

<div {id} class="zone">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="title"
		class:handle={!isMainTree}
		class:handle-copy={!isMainTree && $ctrlKeyIsDown}
		on:click={toggleOpen}
	>
		{name}
	</div>
	<!-- Set transition in this div -->
	{#if isOpen}
		<div>
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
</style>
