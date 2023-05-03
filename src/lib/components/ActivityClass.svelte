<script lang="ts">
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	import { speedMs } from '$lib/stores/appConstants';

	const dispatch = createEventDispatcher();

	export let name: App.ActivityClass['name'];
	export let area: App.ActivityClass['area'];

	let editActClass = false;
	let confirmDelete = false;

	function toggleEdit() {
		confirmDelete = false;
		editActClass = !editActClass;
	}

	function deleteActClass() {
		if (confirmDelete) {
			dispatch('remove');
		} else {
			confirmDelete = true;
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="draggable" transition:slide|local={{ duration: speedMs }}>
	{#if editActClass}
		<div class="edit-act">
			<button type="button" class:ru-sure={confirmDelete} on:click={deleteActClass}>-</button>
		</div>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="handle" on:click={toggleEdit}>
		<div class="act-name">
			{name}
		</div>
		<div class="act-details">
			{area}m2
		</div>
	</div>
</div>

<style>
	.act-details {
		font-size: small;
		font-style: italic;
		color: var(--mid);
	}

	.ru-sure {
		background-color: var(--cancel);
	}
</style>
