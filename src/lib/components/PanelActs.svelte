<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Sortable from 'sortablejs';
	import AddActiv from '$lib/components/AddActiv.svelte';

	import { dragNewActivity } from '$lib/stores/appState';
	import { activityLib } from '$lib/stores/activityLib';
	import { speedMs } from '$lib/stores/appConstants';

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
			animation: speedMs,
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

<div class="panel radius flex-column" style="flex-grow: 1;">
	<div class="header">
		<div class="title">Activities</div>
	</div>
	<AddActiv />
	<div class="container custom-overflow" class:empty={$activityLib.length < 1} bind:this={sortEl}>
		{#each $activityLib as act (act.id)}
			<div class="handle draggable" transition:slide|local={{ duration: speedMs }}>
				{act.name} ({act.area}m2)
			</div>
		{/each}
	</div>
</div>

<style>
	.flex-column {
		display: flex;
		flex-direction: column;
		/* flex-grow: 1; */
		min-height: 0px;
	}

	.custom-overflow {
		overflow-y: auto;
		overflow-x: hidden;
		/* height: 100%; */
		flex-grow: 1;
	}
</style>
