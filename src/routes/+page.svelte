<script lang="ts">
	import Zone from '$lib/components/Zone.svelte';
	import PanelActs from '$lib/components/PanelActs.svelte';
	import PanelNewZone from '$lib/components/PanelNewZone.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown } from '$lib/stores/appState';

	function handleKeydown(ev: KeyboardEvent) {
		ctrlKeyIsDown.set(ev.ctrlKey);
	}

	$: dataAsJSON = JSON.stringify($mainTree, null, 2);
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeydown} />

<a href="/store">Check Store State</a>

{$ctrlKeyIsDown}

<div style="display: flex;">
	<PanelActs />
	<PanelNewZone />

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
	<!-- 	<pre>
{dataAsJSON}
	</pre> -->
</div>
