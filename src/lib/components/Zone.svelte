<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import Activity from '$lib/components/Activity.svelte';

	onMount(() => {
		setupSortable();
	});

	let dispatch = createEventDispatcher();

	export let id: string;
	export let name: string;
	export let children: (App.Zone | App.Activity)[];
	export let mainTree = false;
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

				// Prevet duplicated id's in list
				if (duplicatedId(e.item.id)) {
					dispatch('id-conflict');
					return;
				}

				// Accept items only from list "zone"
				// @ts-ignore
				if (e.fromSortable.options.group.name == 'zone') {
					// console.log('moving:', e.item);

					let moveMap = {
						// @ts-ignore
						from_list: e.fromSortable.el.getAttribute('map'),
						from_index: e.oldIndex,
						// @ts-ignore
						to_list: e.toSortable.el.getAttribute('map'),
						to_index: e.newIndex
					};

					dispatch('move-item', moveMap);
				}
			},

			onSort: (e) => {
				// drag & drop within the same list

				// @ts-ignore
				const oldLi = children[e.oldIndex];
				// @ts-ignore
				children.splice(e.oldIndex, 1);
				// @ts-ignore
				children.splice(e.newIndex, 0, oldLi);

				// Update all the tree to keep data in sync with DOM
				dispatch('main-tree-update');
			}
		});

		function duplicatedId(id: string) {
			for (let i = 0; i < children.length; i++) {
				if (children[i].id == id) {
					alert('Item already in list!');
					return true;
				}
			}
			return false;
		}
	}
</script>

<div {id} class="zone">
	<div class="title" class:handle={!mainTree}>{name}</div>
	<div class="z-content" bind:this={zoneSortEl} map={route}>
		{#each children as child (child.id)}
			{#if child.type == 'zone'}
				<svelte:self
					id={child.id}
					name={child.name}
					children={child.children}
					route={child.route}
					on:main-tree-update
					on:id-conflict
					on:move-item
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
