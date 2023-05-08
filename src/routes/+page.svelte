<script lang="ts">
	import { assets } from '$app/paths';
	import { slide } from 'svelte/transition';
	import Zone from '$lib/components/Zone.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';
	import MainActions from '$lib/components/MainTreeActions.svelte';
	import GraphSunburst from '$lib/components/GraphSunburst.svelte';
	import GraphSizedTree from '$lib/components/GraphSizedTree.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, selectedId } from '$lib/stores/appState';
	import { speedMs } from '$lib/stores/appConstants';

	import { readTextFile, writeTextFile } from '$lib/util/fileMgmt';

	let mtZone: HTMLElement;

	let view = 'editor';
	let showSidePanel = true;

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

	function loadTree(ev: CustomEvent) {
		if (!ev.detail) return;

		readTextFile(ev.detail[0], (mtJSON: string) => {
			mainTree.loadMainTree(JSON.parse(mtJSON));
		});
	}

	function saveTree() {
		writeTextFile(JSON.stringify($mainTree), $mainTree.name, '.systree');
	}
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeydown} />

<svelte:head>
	<script defer src="{assets}/scripts/d3.v4.min.js"></script>
	<script defer src="{assets}/scripts/d3.min.js"></script>
	<script defer src="{assets}/scripts/sunburst-chart.js"></script>
</svelte:head>

<div class="layout">
	<!-- <a href="/store">Check Store State</a> -->
	{#if view == 'editor'}
		<div>
			<div
				style="height: 100%;"
				transition:slide|local={{ axis: 'x', duration: speedMs }}
				on:introend={() => (showSidePanel = true)}
				on:outroend={() => (showSidePanel = false)}
			>
				<SidePanel />
			</div>
		</div>
	{/if}

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="mt-zone" bind:this={mtZone} on:click={handleMtZoneClick}>
		<MainActions
			on:new={() => {
				mainTree.newMainTree('Main');
			}}
			on:load={loadTree}
			on:save={saveTree}
			on:change-view={(e) => (view = e.detail)}
		/>
		<div>
			{#if view == 'editor'}
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
			{:else if view == 'sunburst' && !showSidePanel}
				<GraphSunburst />
			{:else if view == 'sized-tree' && !showSidePanel}
				<GraphSizedTree />
			{/if}
		</div>
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
