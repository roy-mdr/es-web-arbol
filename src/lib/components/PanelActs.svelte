<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Sortable from 'sortablejs';
	import AddActiv from '$lib/components/AddActiv.svelte';

	import { dragNewActivity } from '$lib/stores/appState';
	import { activityLib } from '$lib/stores/activityLib';
	import { speedMs } from '$lib/stores/appConstants';

	import { readTextFile, writeTextFile } from '$lib/util/fileMgmt';

	onMount(() => {
		setupSortable();
	});

	let sortEl: HTMLElement;
	let fileSelect: HTMLInputElement;

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

	function loadActLib() {
		if (!fileSelect || !fileSelect.files) return;

		readTextFile(fileSelect.files[0], (mtJSON: string) => {
			activityLib.loadLibrary(JSON.parse(mtJSON));
		});
	}

	function saveActLib() {
		writeTextFile(JSON.stringify($activityLib), 'My Activity Library', '.actlib');
	}
</script>

<div class="panel radius flex-column" style="flex-grow: 1;">
	<div class="header">
		<div class="title">Activities</div>
	</div>

	<input type="file" bind:this={fileSelect} on:change={loadActLib} />
	<button type="button" on:click={saveActLib}>Save Activities</button>

	<AddActiv />

	<div class="container custom-overflow" class:empty={$activityLib.length < 1} bind:this={sortEl}>
		{#each $activityLib as act (act.id)}
			<div class="handle draggable" transition:slide|local={{ duration: speedMs }}>
				<div class="act-name">
					{act.name}
				</div>
				<div class="act-details">
					{act.area}m2
				</div>
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

	.act-details {
		font-size: small;
		font-style: italic;
		color: var(--mid);
	}
</style>
