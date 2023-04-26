<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Sortable from 'sortablejs';
	import Zone from './Zone.svelte';
	import Activity from '$lib/components/Activity.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, dragNewActivity, draggingType, draggingData } from '$lib/stores/appState';

	onMount(() => {
		setupSortable(zoneSortEl);
	});

	onDestroy(() => {
		if (zoneSortable) {
			zoneSortable.destroy();
			zoneSortable = undefined;
		}
	});

	export let content: App.Zone['children'];
	export let route: App.Zone['route'];

	let zoneSortEl: HTMLElement;
	let zoneSortable: Sortable | undefined;

	$: toggleSortableClone($ctrlKeyIsDown);

	function toggleSortableClone(ctrlKeyDown: boolean) {
		if (!zoneSortable) return;

		if (ctrlKeyDown) {
			zoneSortable?.option('group', {
				name: 'zone',
				put: ['zone', 'panel-act', 'panel-zone'],
				pull: 'clone'
			});
		} else {
			zoneSortable?.option('group', {
				name: 'zone',
				put: ['zone', 'panel-act', 'panel-zone']
			});
		}
	}

	// $: setupSortable(zoneSortEl);

	function setupSortable(sortableEl: HTMLElement) {
		if (!sortableEl) return;

		zoneSortable = Sortable.create(sortableEl, {
			group: {
				name: 'zone',
				put: ['zone', 'panel-act', 'panel-zone']
			},
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

					const moveMap = {
						from_list: e.from.getAttribute('map') || '0',
						from_index: e.oldIndex || 0,
						to_list: e.to.getAttribute('map') || '0',
						to_index: e.newIndex || 0
					};

					if ($ctrlKeyIsDown) {
						mainTree.copyItem(moveMap);
					} else {
						mainTree.moveItem(moveMap);
					}
				}

				// If origin list is "panel-act"
				// @ts-ignore
				if (e.fromSortable.options.group.name == 'panel-act') {
					// console.log('adding:', e.item);

					if (!$dragNewActivity) return;

					const newActData = <App.ActivityClass>$dragNewActivity;
					const to_list = e.to.getAttribute('map') || '0';
					const to_index = e.newIndex || 0;

					mainTree.addActivity(to_list, to_index, { name: newActData.name });
				}

				// If origin list is "panel-zone"
				// @ts-ignore
				if (e.fromSortable.options.group.name == 'panel-zone') {
					const to_list = e.to.getAttribute('map') || '0';
					const to_index = e.newIndex || 0;

					mainTree.addZone(to_list, to_index, { name: 'New Zone' });
				}
			},

			onSort: (e) => {
				// drag & drop within the same list

				if ($ctrlKeyIsDown) {
					const moveMap = {
						from_list: e.from.getAttribute('map') || '0',
						from_index: e.oldIndex || 0,
						to_list: e.to.getAttribute('map') || '0',
						to_index: e.newIndex || 0
					};

					// only for copy in same list
					if (moveMap.to_index > moveMap.from_index) {
						moveMap.to_index++;
					}

					mainTree.copyItem(moveMap);
				} else {
					/*
					{
						mainTree.moveItem(moveMap);
					}
					return;
					*/

					// @ts-ignore
					const movingItem = content[e.oldIndex];

					// Remove item from 'from' list
					// @ts-ignore
					content.splice(e.oldIndex, 1);

					// Copy item to 'to' list
					// @ts-ignore
					content.splice(e.newIndex, 0, movingItem);

					// Update all the tree to keep data in sync with DOM
					mainTree.rebuild();
				}
			},

			onStart: (e) => {
				// ~ dragstart:
				// draggingEl.update( (el) => e.item ); // trigger
				// ~ own dataTransfer.setData():
				draggingType.update((t) => 'zone-item');
				draggingData.update((d) => `${e.from.getAttribute('map')}|${e.oldIndex}`);
				// draggingParentEl.update((p) => inboxEl);
			},

			onEnd: (e) => {
				// ~ dragend:
				// draggingEl.update( (el) => undefined ); // kinda unnecesary (it is handled by the polyfill drop event)
				// ~ own dataTransfer.setData():
				draggingType.update((t) => '');
				draggingData.update((d) => '');
			}
		});
	}
</script>

<div class="z-content" bind:this={zoneSortEl} map={route}>
	{#each content as child (child.id)}
		{#if child.type == 'zone'}
			<Zone
				id={child.id}
				name={child.name}
				children={child.children}
				route={child.route}
				isOpen={child.open}
			/>
		{:else if child.type == 'act'}
			<Activity id={child.id} name={child.name} ctrlDown={$ctrlKeyIsDown} />
		{/if}
	{/each}
</div>
