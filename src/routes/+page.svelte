<script lang="ts">
	import Zone from '$lib/components/Zone.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, selectedId } from '$lib/stores/appState';

	let mtZone: HTMLElement;

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
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeydown} />

<div class="layout">
	<!-- <a href="/store">Check Store State</a> -->
	<SidePanel />

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="mt-zone" bind:this={mtZone} on:click={handleMtZoneClick}>
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
