<script lang="ts">
	import { slide } from 'svelte/transition';
	import { Upload, Save, Plus, ChevronUp } from 'lucide-svelte';
	import FileButton from '$lib/components/FileButton.svelte';
	import FormStyle from '$lib/components/FormStyle.svelte';

	import { activityLib } from '$lib/stores/activityLib';
	import { speedMs, iconSize } from '$lib/stores/appConstants';

	import { readTextFile, writeTextFile } from '$lib/util/fileMgmt';
	import { evalFloat } from '$lib/util/normalizeTxt';

	let loadFile: FileList;
	let inputName: HTMLInputElement;
	let inputArea: HTMLInputElement;

	let openAdd = false;

	interface NewActivityClassInput extends Omit<App.NewActivityClass, 'area'> {
		area: string | undefined;
	}

	let newAct: NewActivityClassInput = {
		name: '',
		area: undefined
	};

	function focusInput(trigger: any) {
		if (inputName) inputName.focus();
	}
	$: focusInput(inputName);

	function addActAndReset() {
		const areaFloat = evalFloat(newAct.area || '');

		if (!areaFloat) {
			inputArea.value = '';
			inputArea.focus();
			return;
		}

		activityLib.addActivity({
			name: newAct.name,
			area: parseFloat(areaFloat)
		});

		newAct = {
			name: '',
			area: undefined
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
			<div transition:slide|local={{ duration: speedMs }}>
				<FormStyle
					autocomplete="off"
					style="border-top-left-radius: 0; border-top-right-radius: 0;"
					on:submit={addActAndReset}
				>
					<div class="row">
						<input
							type="text"
							name="name"
							autocomplete="off"
							placeholder="Name..."
							class="unit"
							bind:value={newAct.name}
							bind:this={inputName}
						/>
					</div>
					<div class="row">
						<input
							type="text"
							name="area"
							autocomplete="off"
							placeholder="Area..."
							class="unit"
							bind:value={newAct.area}
							bind:this={inputArea}
						/>
						<button type="submit" class="unit">
							<Plus size={iconSize} />
						</button>
					</div>
				</FormStyle>
			</div>
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
</style>
