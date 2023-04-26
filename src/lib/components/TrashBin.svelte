<script lang="ts">
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, draggingType, draggingData } from '$lib/stores/appState';

	onMount(() => {
		setupSortable();
	});

	let sortEl: HTMLElement;
	let isHover = false;

	function setupSortable() {
		Sortable.create(sortEl, {
			group: {
				name: 'trashbin',
				pull: false,
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

			// @ts-ignore
			onDragIn: (e) => {
				if ($draggingType == 'zone-item' && !isHover) {
					console.log('in');
					isHover = true;
				}
			},

			// @ts-ignore
			onDragOut: (e) => {
				console.log('out');
				isHover = false;
			},

			// @ts-ignore
			onDrop: (e) => {
				console.log('Dropped!', $draggingData);
				isHover = false;

				/*
				if (e.explicitOriginalTarget === sortEl) {
					// if (e.fromSortable.options.group.name == 'zone') {
					// console.log('deleting:', e.item);

					let from_list = e.from.getAttribute('map') || '0';
					let from_index = e.oldIndex || 0;

					if ($ctrlKeyIsDown) return;

					mainTree.deleteItem(from_list, from_index);
					// }
				}
				*/
			},

			onAdd: (e) => {
				// drag from one list and drop into another

				// If origin list is "zone"
				// @ts-ignore
				if ($draggingType == 'zone-item' && isHover) {
					// console.log('moving:', e.item);

					let from_list = e.from.getAttribute('map') || '0';
					let from_index = e.oldIndex || 0;

					if ($ctrlKeyIsDown) return;

					mainTree.deleteItem(from_list, from_index);
				}
				isHover = false;
			}
		});
	}
</script>

<div class="panel">
	<div class="container" class:is-hover={isHover} bind:this={sortEl}>
		<p>Delete</p>
	</div>
</div>

<style>
	.panel :global(.sortable-ghost) {
		display: none !important;
	}

	.panel {
		display: flex;
	}

	.container {
		background-color: white;
		border: 1px solid white;
		margin: 1em;
		padding: 0.5em;
		min-width: 250px;
		border-radius: 10px;
		box-shadow: 0px 1px 1px 0 rgb(0 0 0 / 10%);
		transition: all 0.2s;
	}

	.container.is-hover {
		border: 1px solid #ff3e00;
		box-shadow: 0px 5px 5px 0 rgb(0 0 0 / 10%);
	}
</style>
