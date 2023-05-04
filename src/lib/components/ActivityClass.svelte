<script lang="ts">
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { Trash2 } from 'lucide-svelte';
	import ConfirmButton from '$lib/components/ConfirmButton.svelte';

	import { speedMs, iconSize } from '$lib/stores/appConstants';

	const dispatch = createEventDispatcher();

	export let name: App.ActivityClass['name'];
	export let area: App.ActivityClass['area'];

	let editActClass = false;

	function toggleEdit() {
		editActClass = !editActClass;
	}

	function deleteActClass() {
		dispatch('remove');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="draggable" transition:slide|local={{ duration: speedMs }}>
	{#if editActClass}
		<div class="edit-act">
			<ConfirmButton on:confirm={deleteActClass}>
				<Trash2 size={iconSize} />
			</ConfirmButton>
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
</style>
