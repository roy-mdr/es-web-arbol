<script lang="ts">
	import { slide } from 'svelte/transition';
	import ZoneSortable from '$lib/components/ZoneSortable.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, selectedId } from '$lib/stores/appState';
	import { speedMs } from '$lib/stores/appConstants';

	export let id: App.Zone['id'];
	export let name: App.Zone['name'];
	export let children: App.Zone['children'];
	export let isMainTree = false;
	export let route: App.Zone['route'];
	export let isOpen: App.Zone['open'] = true;
	export let factor: App.Zone['factor'];
	export let sum: App.Zone['sum'];
	export let sumfactor: App.Zone['sumfactor'];
	export let color: App.Zone['color'];

	$: bgColor = color === undefined ? '' : `background-color: ${color};`;
	$: lineColor = color === undefined ? '' : `border-color: ${color};`;

	function toggleOpen() {
		mainTree.toggleOpenZone(route);
	}

	function toggleSelect() {
		if ($selectedId == id) {
			selectedId.set('');
		} else {
			selectedId.set(id);
		}
	}
</script>

<div
	{id}
	class="panel zone"
	class:radius={isMainTree}
	class:selected={$selectedId == id}
	style="{bgColor} {lineColor}"
>
	<div class="header">
		{#if !isMainTree}
			<div class="arrow-wrapper">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="arrow" class:open={isOpen} on:click={toggleOpen}>►</div>
			</div>
		{/if}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="title"
			class:handle={!isMainTree}
			class:handle-copy={!isMainTree && $ctrlKeyIsDown}
			on:click={toggleSelect}
		>
			<div class="zone-name">
				{name}
			</div>
			<div class="zone-sumfactor">
				{Math.round((sumfactor + Number.EPSILON) * 100) / 100}m2
			</div>
			<div class="zone-details">
				{Math.round((sum + Number.EPSILON) * 100) / 100}m2 + {factor * 100}%
			</div>
		</div>
	</div>
	<!-- Set transition in this div -->
	{#if isOpen}
		<div transition:slide|local={{ duration: speedMs }}>
			<ZoneSortable {route} content={children} />
		</div>
	{/if}
</div>

<style>
	.arrow-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.arrow {
		margin-right: var(--space-half);
		cursor: pointer;
		transition: transform var(--speed-normal);
	}

	.arrow.open {
		transform: rotate(90deg);
	}

	.selected {
		background-color: var(--accent) !important;
		border: 1px solid var(--accent) !important;
	}

	.zone-sumfactor,
	.zone-details {
		font-size: small;
		font-style: italic;
		color: var(--main-text-50pct);
	}

	.zone-sumfactor {
		font-weight: bold;
	}

	.zone-details {
		font-weight: normal;
	}
</style>
