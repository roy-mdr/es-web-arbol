<script lang="ts">
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { Trash2 } from 'lucide-svelte';
	import ConfirmButton from '$lib/components/ConfirmButton.svelte';

	import { speedMs, iconSize } from '$lib/stores/appConstants';

	import clickOutside from '$lib/util/clickOutside';

	const dispatch = createEventDispatcher();

	export let id: App.ActivityClass['id'];
	export let name: App.ActivityClass['name'];
	export let area: App.ActivityClass['area'];
	export let disabled: boolean;

	let editActClass = false;

	function toggleEdit() {
		editActClass = !editActClass;
	}

	function deleteActClass() {
		dispatch('remove');
	}

	function startTransition() {
		dispatch('start-transition');
	}

	function endTransition() {
		dispatch('end-transition');
	}
</script>

<div
	{id}
	class="act-class"
	transition:slide|local={{ duration: speedMs }}
	on:introstart={startTransition}
	on:outrostart={startTransition}
	on:introend={endTransition}
	on:outroend={endTransition}
	use:clickOutside
	on:click_outside={() => (editActClass = false)}
>
	<div class="edit-act-cont">
		{#if editActClass}
			<div
				class="edit-act"
				transition:slide|local={{ axis: 'x', duration: speedMs }}
				on:introstart={startTransition}
				on:outrostart={startTransition}
				on:introend={endTransition}
				on:outroend={endTransition}
			>
				<ConfirmButton on:confirm={deleteActClass}>
					<Trash2 size={iconSize} color="var(--main-text-50pct)" />
				</ConfirmButton>
			</div>
		{/if}
	</div>

	<div class="draggable">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class:handle={!disabled} on:click={toggleEdit}>
			<div class="act-name">
				{name}
			</div>
			<div class="act-details">
				{area}m2
			</div>
		</div>
	</div>
</div>

<style>
	.act-class {
		position: relative;
		overflow: hidden;
		display: grid;
		grid-template-columns: auto 1fr;
	}

	.act-details {
		font-size: small;
		font-style: italic;
		color: var(--mid);
	}

	.edit-act-cont {
		display: flex;
		width: max-content;
		height: 100%;
	}

	.edit-act {
		display: flex;
		height: 100%;
	}

	.edit-act :global(button) {
		background-color: var(--background);
		padding: var(--space-half);
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		transition: background-color var(--speed-normal);
	}

	.edit-act :global(button:hover) {
		cursor: pointer;
	}
</style>
