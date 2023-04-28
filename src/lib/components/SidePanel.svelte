<script lang="ts">
	import EditSelected from '$lib/components/EditSelected.svelte';
	import PanelActs from '$lib/components/PanelActs.svelte';
	import PanelNewZone from '$lib/components/PanelNewZone.svelte';
	import TrashBin from '$lib/components/TrashBin.svelte';
</script>

<div class="side-panel">
	<TrashBin />
	<PanelNewZone />
	<PanelActs />
	<EditSelected />
</div>

<style>
	.side-panel {
		height: 100%;
		display: grid;
		grid-template-rows: auto auto 1fr auto;
	}

	.side-panel :global(> *) {
		margin-right: var(--space-half);
		margin-bottom: var(--space-half);
		margin-left: var(--space-half);
	}

	.side-panel :global(> *:first-child) {
		margin-top: var(--space-half);
	}
</style>
