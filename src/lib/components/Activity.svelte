<script lang="ts">
	export let id: App.Activity['id'];
	export let name: App.Activity['name'];
	export let ctrlDown: boolean;
</script>

<div {id} class="handle activ" class:handle-copy={ctrlDown}>{name}</div>

<style>
	.activ {
		padding: 0.5em;
		margin: 0.5em;
		background-color: white;
		box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25);
		border-radius: 2px;
	}
</style>
