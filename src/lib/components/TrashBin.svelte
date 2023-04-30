<script lang="ts">
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, draggingType, draggingData } from '$lib/stores/appState';
	import { speedMs } from '$lib/stores/appConstants';

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
				put: ['group']
			},
			sort: false,
			// @ts-ignore
			revertDOM: true,
			animation: speedMs,
			handle: '.handle',
			fallbackOnBody: true,
			invertSwap: true,
			delay: 200,
			delayOnTouchOnly: true,

			// @ts-ignore
			onDragIn: (e) => {
				if ($draggingType == 'group-item' && !isHover) {
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
					// if (e.fromSortable.options.group.name == 'group') {
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

				// If origin list is "group"
				// @ts-ignore
				if ($draggingType == 'group-item' && isHover) {
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

<div class="panel radius">
	<div class="container" bind:this={sortEl}>
		<div class="icon" class:is-hover={isHover}>Trash Bin</div>
	</div>
</div>

<style>
	.panel :global(.sortable-ghost) {
		display: none !important;
	}

	.icon {
		background-color: var(--carpet);
		padding: var(--space-unit);
		color: var(--main-text);
		border: 1px solid var(--light);
		border-radius: var(--radius-unit);
		transition: background-color var(--speed-normal);
	}

	.is-hover {
		border-color: var(--cancel);
		background-color: var(--cancel);
		box-shadow: inset var(--shadow-hover);
	}
</style>
