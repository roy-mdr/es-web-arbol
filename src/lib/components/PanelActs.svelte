<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Sortable from 'sortablejs';
	import { Upload, Save, Plus, ChevronUp } from 'lucide-svelte';
	import AddActiv from '$lib/components/AddActiv.svelte';
	import ActivityClass from '$lib/components/ActivityClass.svelte';
	import FileButton from '$lib/components/FileButton.svelte';
	import FilterActiv from '$lib/components/FilterActiv.svelte';

	import { dragNewActivity } from '$lib/stores/appState';
	import { activityLib, activityLibFiltered } from '$lib/stores/activityLib';
	import { speedMs, iconSize } from '$lib/stores/appConstants';

	import { readTextFile, writeTextFile } from '$lib/util/fileMgmt';

	onMount(() => {
		setupSortable();
	});

	let sortEl: HTMLElement;
	let loadFile: FileList;

	let openAdd = false;
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

	function loadActLib() {
		if (!loadFile) return;

		readTextFile(loadFile[0], (mtJSON: string) => {
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

	<div class="btn-group" style="width: 100%;">
		<FileButton
			style="flex-grow: 1;"
			name="upload"
			accept=".actlib"
			bind:files={loadFile}
			on:change={loadActLib}
		>
			<Upload size={iconSize} />
		</FileButton>
		<div style="flex-grow: 1;">
			<button type="button" on:click={saveActLib}>
				<Save size={iconSize} />
			</button>
		</div>
		<div style="flex-grow: 1;">
			<button
				type="button"
				on:click={() => {
					openAdd = !openAdd;
				}}
			>
				{#if openAdd}
					<ChevronUp size={iconSize} />
				{:else}
					<Plus size={iconSize} />
				{/if}
			</button>
		</div>
	</div>

	{#if openAdd}
		<div transition:slide|local={{ duration: speedMs }}>
			<AddActiv />
		</div>
	{/if}

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
