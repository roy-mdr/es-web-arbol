<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown } from '$lib/stores/appState';

	onMount(() => {
		setupSortable();
	});

	let sortEl: HTMLElement;

	function setupSortable() {
		Sortable.create(sortEl, {
			group: {
				name: 'trashbin',
				put: ['zone']
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

			onAdd: (e) => {
				// drag from one list and drop into another

				// If origin list is "zone"
				// @ts-ignore
				if (e.fromSortable.options.group.name == 'zone') {
					// console.log('moving:', e.item);

					let from_list = e.from.getAttribute('map') || '0';
					let from_index = e.oldIndex || 0;

					if ($ctrlKeyIsDown) return;

					mainTree.deleteItem(from_list, from_index);
				}
			}
		});
	}
</script>

<div class="panel">
	<div class="title">Delete</div>
	<div class="p-content" bind:this={sortEl} />
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
