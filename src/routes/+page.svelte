<script lang="ts">
	import Zone from '$lib/components/Zone.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, selectedId } from '$lib/stores/appState';

	function handleKeydown(ev: KeyboardEvent) {
		ctrlKeyIsDown.set(ev.ctrlKey);

		if (ev.key === 'Escape') {
			selectedId.set('');
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeydown} />

<div class="layout">
	<!-- <a href="/store">Check Store State</a> -->
	<SidePanel />

	<div class="panel-zone">
		{#key $mainTree.id}
			<Zone
				id={$mainTree.id}
				name={$mainTree.name}
				children={$mainTree.children}
				route={$mainTree.route}
				isMainTree={true}
				isOpen={$mainTree.open}
			/>
		{/key}
	</div>
</div>

<style>
	.layout {
		display: flex;
		height: 100vh;
	}

	.panel-zone {
		overflow: auto;
		width: 100%;
		padding: 10em;
	}
</style>
