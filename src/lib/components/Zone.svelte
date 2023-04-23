<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import Activity from '$lib/components/Activity.svelte';

	import { mainTree } from '$lib/stores/mainTree';

	onMount(() => {
		setupSortable();
	});

	export let id: string;
	export let name: string;
	export let children: (App.Zone | App.Activity)[];
	export let isMainTree = false;
	export let route: string;

	let zoneSortEl: HTMLElement;

	function setupSortable() {
		Sortable.create(zoneSortEl, {
			group: 'zone',
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

				// Accept items only from list "zone"
				// @ts-ignore
				if (e.fromSortable.options.group.name == 'zone') {
					// console.log('moving:', e.item);

					let moveMap = {
						from_list: e.from.getAttribute('map') || '0',
						from_index: e.oldIndex || 0,
						to_list: e.to.getAttribute('map') || '0',
						to_index: e.newIndex || 0
					};

					mainTree.moveItem(moveMap);
				}
			},

			onSort: (e) => {
				// drag & drop within the same list
				let moveMap = {
					from_list: e.from.getAttribute('map') || '0',
					from_index: e.oldIndex || 0,
					to_list: e.to.getAttribute('map') || '0',
					to_index: e.newIndex || 0
				};

				// /*
				{
					// only for copy
					if (moveMap.to_index > moveMap.from_index) {
						moveMap.to_index++;
					}

					mainTree.copyItem(moveMap);
				}
				// */

				/*
				{
					mainTree.moveItem(moveMap);
				}
				*/

				return;

				// @ts-ignore
				const movingItem = children[e.oldIndex];

				// Remove item from 'from' list
				// @ts-ignore
				children.splice(e.oldIndex, 1);

				// Copy item to 'to' list
				// @ts-ignore
				children.splice(e.newIndex, 0, movingItem);

				// Update all the tree to keep data in sync with DOM
				mainTree.rebuild();
			}
		});
	}
</script>

<div {id} class="zone">
	<div class="title" class:handle={!isMainTree}>{name}</div>
	<div class="z-content" bind:this={zoneSortEl} map={route}>
		{#each children as child (child.id)}
			{#if child.type == 'zone'}
				<svelte:self
					id={child.id}
					name={child.name}
					children={child.children}
					route={child.route}
				/>
			{:else if child.type == 'act'}
				<Activity id={child.id} name={child.name} />
			{/if}
		{/each}
	</div>
</div>

<style>
	.zone {
		padding: 0.5em;
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 2px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
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
