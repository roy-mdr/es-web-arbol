<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import { BoxSelect } from 'lucide-svelte';

	import { iconSize } from '$lib/stores/appConstants';
	import { speedMs } from '$lib/stores/appConstants';

	onMount(() => {
		setupSortable();
	});

	let sortEl: HTMLElement;

	function setupSortable() {
		Sortable.create(sortEl, {
			group: {
				name: 'panel-zone',
				pull: 'clone'
			},
			sort: false,
			// @ts-ignore
			revertDOM: true,
			animation: speedMs,
			handle: '.handle',
			fallbackOnBody: true,
			invertSwap: true,
			delay: 200,
			delayOnTouchOnly: true
		});
	}
</script>

<div class="panel radius">
	<div class="header">
		<div class="title">Zones</div>
	</div>
	<div class="container" bind:this={sortEl}>
		<div class="handle draggable flex-center">
			<BoxSelect size={iconSize} />
			<span> New Zone </span>
		</div>
	</div>
</div>

<style>
	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.flex-center span {
		margin-left: var(--space-half);
	}
</style>
