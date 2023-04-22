<script lang="ts">
	export let route: string;
	export let id: string;
	export let name: string;
</script>

<div {id} class="handle activ" map={route}>{name}</div>

<style>
	.handle {
		cursor: grab;
	}

	.activ {
		padding: 0.5em;
		margin: 0.5em;
		background-color: white;
		box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25);
		border-radius: 2px;
	}
</style>
