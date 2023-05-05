<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import ActivityLibActions from '$lib/components/ActivityLibActions.svelte';
	import ActivityClass from '$lib/components/ActivityClass.svelte';
	import FilterActiv from '$lib/components/FilterActiv.svelte';

	import { dragNewActivity } from '$lib/stores/appState';
	import { activityLib, activityLibFiltered } from '$lib/stores/activityLib';
	import { speedMs } from '$lib/stores/appConstants';

	onMount(() => {
		setupSortable();
	});

	let sortEl: HTMLElement;

	let transitioning = false;

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
				const selectAct = activityLib.selectById(e.item.id);
				if (!selectAct) return;
				dragNewActivity.setActData(selectAct);
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

	<ActivityLibActions />

	<FilterActiv />

	<div class="container custom-overflow" class:empty={$activityLib.length < 1} bind:this={sortEl}>
		{#each $activityLibFiltered as act (act.id)}
			<ActivityClass
				id={act.id}
				name={act.name}
				area={act.area}
				disabled={transitioning}
				on:remove={() => {
					activityLib.deleteActivity(act.id);
				}}
				on:start-transition={() => (transitioning = true)}
				on:end-transition={() => (transitioning = false)}
			/>
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
