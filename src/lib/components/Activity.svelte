<script lang="ts">
	import { selectedId } from '$lib/stores/appState';

	export let id: App.Activity['id'];
	export let name: App.Activity['name'];
	export let ctrlDown: boolean;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	{id}
	class="handle activ"
	class:handle-copy={ctrlDown}
	class:selected={$selectedId == id}
	on:click={() => selectedId.set(id)}
>
	{name}
</div>

<style>
	.activ {
		padding: 0.5em;
		margin: 0.5em;
		background-color: white;
		box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25);
		border-radius: 2px;
	}

	.selected {
		border: 1px solid #ff3e00;
	}
</style>
