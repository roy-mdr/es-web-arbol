<script lang="ts">
	import { Upload, Save } from 'lucide-svelte';
	import Zone from '$lib/components/Zone.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';
	import FileButton from '$lib/components/FileButton.svelte';

	import { iconSize } from '$lib/stores/appConstants';
	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, selectedId } from '$lib/stores/appState';

	import { readTextFile, writeTextFile } from '$lib/util/fileMgmt';

	let mtZone: HTMLElement;
	let loadFile: FileList;

	function handleKeydown(ev: KeyboardEvent) {
		ctrlKeyIsDown.set(ev.ctrlKey);

		if (ev.key === 'Escape') {
			selectedId.set('');
		}
	}

	function handleMtZoneClick(ev: Event) {
		if (ev.target === mtZone) {
			selectedId.set('');
		}
	}

	function loadTree() {
		if (!loadFile) return;

		readTextFile(loadFile[0], (mtJSON: string) => {
			mainTree.loadMainTree(JSON.parse(mtJSON));
		});
	}

	function saveTree() {
		writeTextFile(JSON.stringify($mainTree), $mainTree.name, '.systree');
	}
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeydown} />

<div class="layout">
	<!-- <a href="/store">Check Store State</a> -->
	<SidePanel />

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="mt-zone" bind:this={mtZone} on:click={handleMtZoneClick}>
		<FileButton name="upload" accept=".systree" bind:files={loadFile} on:change={loadTree}>
			<Upload size={iconSize} />
		</FileButton>
		<button type="button" on:click={saveTree}>
			<Save size={iconSize} />
		</button>
		<a href="/sunburst" target="_blank">View Flare Graph</a>
		<a href="/sized-tree" target="_blank">View Sized-Tree Graph</a>
		{#key $mainTree.id}
			<Zone
				id={$mainTree.id}
				name={$mainTree.name}
				children={$mainTree.children}
				route={$mainTree.route}
				isMainTree={true}
				isOpen={$mainTree.open}
				factor={$mainTree.factor}
				sum={$mainTree.sum}
				sumfactor={$mainTree.sumfactor}
				color={$mainTree.color}
			/>
		{/key}
	</div>
</div>

<style>
	.layout {
		display: flex;
		height: 100%;
	}

	.mt-zone {
		overflow: auto;
		width: 100%;
		padding: 10em;
	}
</style>
