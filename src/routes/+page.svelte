<script lang="ts">
	import Zone from '$lib/components/Zone.svelte';

	import { mainTree } from '$lib/stores/mainTree';

	$: dataAsJSON = JSON.stringify($mainTree, null, 2);
</script>

<a href="/store">Check Store State</a>

<div style="display: flex;">
	{#key $mainTree.id}
		<Zone
			id={$mainTree.id}
			name={$mainTree.name}
			children={$mainTree.children}
			route={$mainTree.route}
			isMainTree={true}
		/>
	{/key}
	<pre>
{dataAsJSON}
	</pre>
</div>
