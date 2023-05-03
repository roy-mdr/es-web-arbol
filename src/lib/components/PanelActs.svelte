<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import { Upload, Save } from 'lucide-svelte';
	import AddActiv from '$lib/components/AddActiv.svelte';
	import ActivityClass from '$lib/components/ActivityClass.svelte';
	import FileButton from '$lib/components/FileButton.svelte';

	import { dragNewActivity } from '$lib/stores/appState';
	import { activityLib } from '$lib/stores/activityLib';
	import { speedMs, iconSize } from '$lib/stores/appConstants';

	import { readTextFile, writeTextFile } from '$lib/util/fileMgmt';

	onMount(() => {
		setupSortable();
	});

	let sortEl: HTMLElement;
	let loadFile: FileList;

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

	<FileButton name="upload" accept=".actlib" bind:files={loadFile} on:change={loadActLib}>
		<Upload size={iconSize} />
	</FileButton>
	<button type="button" on:click={saveActLib}>
		<Save size={iconSize} />
	</button>

	<AddActiv />

	<div class="container custom-overflow" class:empty={$activityLib.length < 1} bind:this={sortEl}>
		{#each $activityLib as act (act.id)}
			<ActivityClass
				name={act.name}
				area={act.area}
				on:remove={() => {
					activityLib.deleteActivity(act.id);
				}}
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
