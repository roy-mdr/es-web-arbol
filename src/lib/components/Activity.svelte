<script lang="ts">
	export let name: string;
</script>

<div class="handle activ">{name}</div>

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
