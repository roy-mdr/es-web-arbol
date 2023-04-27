<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import AddActiv from '$lib/components/AddActiv.svelte';

	import { dragNewActivity } from '$lib/stores/appState';
	import { activityLib } from '$lib/stores/activityLib';

	onMount(() => {
		setupSortable();
	});

	let sortEl: HTMLElement;

	function setupSortable() {
		Sortable.create(sortEl, {
			group: {
				name: 'panel-act',
				pull: 'clone'
			},
			sort: false,
			// @ts-ignore
			revertDOM: true,
			animation: 150,
			handle: '.handle',
			fallbackOnBody: true,
			invertSwap: true,
			delay: 200,
			delayOnTouchOnly: true,

			onStart: (e) => {
				dragNewActivity.setActData($activityLib[<number>e.oldIndex]);
			},

			onEnd: (e) => {
				dragNewActivity.clear();
			}
		});
	}
</script>

<div class="panel">
	<div class="title">Activitis</div>
	<AddActiv />
	<div class="p-content" bind:this={sortEl}>
		{#each $activityLib as act (act.id)}
			<div class="handle activ">{act.name}</div>
		{/each}
	</div>
</div>

<style>
	.panel {
		padding: 0.5em;
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 2px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
		margin: 0.5em;
	}

	.panel :global(.title) {
		font-weight: bold;
		background-color: rgba(0, 0, 0, 0.1);
		width: max-content;
		padding: 0 0.5em;
		border-radius: 2px;
	}

	.panel :global(.handle) {
		cursor: grab;
	}

	.panel :global(.handle.handle-copy) {
		cursor: copy;
	}

	.panel :global(.p-content) {
		margin: 0.5em;
		border-radius: 2px;
		border: 1px dashed rgba(0, 0, 0, 0.25);
		min-height: 2em;
	}

	.activ {
		padding: 0.5em;
		margin: 0.5em;
		background-color: white;
		box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25);
		border-radius: 2px;
	}
</style>
