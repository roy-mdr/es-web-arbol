<script lang="ts">
	export let id: string;
	export let name: string;
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
