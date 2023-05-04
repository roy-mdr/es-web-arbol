<script lang="ts">
	import { selectedId } from '$lib/stores/appState';

	export let id: App.Activity['id'];
	export let name: App.Activity['name'];
	export let area: App.Activity['area'];
	export let ctrlDown: boolean;

	function toggleSelect() {
		if ($selectedId == id) {
			selectedId.set('');
		} else {
			selectedId.set(id);
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	{id}
	class="handle draggable"
	class:handle-copy={ctrlDown}
	class:selected={$selectedId == id}
	on:click={toggleSelect}
>
	<div class="act-name">
		{name}
	</div>
	<div class="act-details">
		{area}m2
	</div>
</div>

<style>
	.selected {
		background-color: var(--accent);
		border: 1px solid var(--accent);
	}

	.act-details {
		font-size: small;
		font-style: italic;
		color: var(--main-text-50pct);
	}
</style>
