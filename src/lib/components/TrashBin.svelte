<script lang="ts">
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	import { Trash2 } from 'lucide-svelte';

	import { speedMs, iconSize } from '$lib/stores/appConstants';
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
			animation: speedMs,
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

<div class="panel radius">
	<div class="container" bind:this={sortEl}>
		<div class="icon" class:is-hover={isHover}>
			<Trash2 size={iconSize} color="var(--main-text-50pct)" />
		</div>
	</div>
</div>

<style>
	.panel :global(.sortable-ghost) {
		display: none !important;
	}

	.icon {
		background-color: var(--carpet);
		padding: var(--space-unit);
		color: var(--main-text-50pct);
		border: 1px solid var(--light);
		border-radius: var(--radius-unit);
		transition: background-color var(--speed-normal);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.is-hover {
		border-color: var(--cancel);
		background-color: var(--cancel);
		box-shadow: inset var(--shadow-hover);
	}
</style>
