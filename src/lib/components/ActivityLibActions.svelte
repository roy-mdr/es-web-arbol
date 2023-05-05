<script lang="ts">
	import { slide } from 'svelte/transition';
	import { Upload, Save, Plus, ChevronUp } from 'lucide-svelte';
	import FileButton from '$lib/components/FileButton.svelte';

	import { activityLib } from '$lib/stores/activityLib';
	import { speedMs, iconSize } from '$lib/stores/appConstants';

	import { readTextFile, writeTextFile } from '$lib/util/fileMgmt';

	let inputName: HTMLElement;
	let loadFile: FileList;

	let openAdd = false;

	let newAct: App.NewActivityClass = {
		name: '',
		area: 0
	};

	function focusInput(trigger: any) {
		if (inputName) inputName.focus();
	}
	$: focusInput(inputName);

	function addActAndReset() {
		activityLib.addActivity(newAct);
		newAct = {
			name: '',
			area: 0
		};
		inputName.focus();
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

<div>
	<div class="btn-group" class:is-open={openAdd} style="width: 100%; padding: 0;">
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

	<div style="margin: -1px;">
		{#if openAdd}
			<form
				autocomplete="off"
				class="draggable"
				on:submit|preventDefault={addActAndReset}
				transition:slide|local={{ duration: speedMs }}
			>
				<input
					type="text"
					name="name"
					autocomplete="off"
					bind:value={newAct.name}
					bind:this={inputName}
				/>
				<input type="text" name="area" autocomplete="off" bind:value={newAct.area} />
				<button type="submit">
					<Plus size={iconSize} />
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.btn-group.is-open :global(> *:first-child button) {
		border-bottom-left-radius: 0;
	}

	.btn-group.is-open :global(> *:last-child button) {
		border-bottom-right-radius: 0;
	}

	form {
		border-bottom-left-radius: var(--radius-unit);
		border-bottom-right-radius: var(--radius-unit);
	}
</style>
