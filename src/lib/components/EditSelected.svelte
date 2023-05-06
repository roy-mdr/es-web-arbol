<script lang="ts">
	import { slide } from 'svelte/transition';
	import { Check, X, Trash2, Copy } from 'lucide-svelte';
	import ConfirmButton from '$lib/components/ConfirmButton.svelte';
	import FormStyle from '$lib/components/FormStyle.svelte';

	import { iconSize } from '$lib/stores/appConstants';
	import { mainTree } from '$lib/stores/mainTree';
	import { selectedId } from '$lib/stores/appState';
	import { speedMs } from '$lib/stores/appConstants';

	import { normalizeTxtSingleLine, eliminarDiacriticosEs, evalFloat } from '$lib/util/normalizeTxt';

	let inputName: HTMLElement;
	let itemData: App.Zone | App.Activity | undefined;
	let itemClone: App.Zone | App.Activity | undefined;

	let setColor = false;

	function getSelected(trigger: any, id: App.Zone['id'] | App.Activity['id']) {
		itemData = mainTree.selectById(id);
		itemClone = structuredClone(itemData);
		setColor = itemClone?.type == 'zone' ? (itemClone?.color ? true : false) : false;
	}

	function focusInput(trigger: any) {
		inputName?.focus();
	}

	$: getSelected($mainTree, $selectedId);
	$: focusInput($selectedId);

	function duplicateItem() {
		const { parentRoute, thisIndex } = getIndex();

		mainTree.copyItem({
			from_list: parentRoute || '',
			from_index: thisIndex || 0,
			to_list: parentRoute || '',
			to_index: (thisIndex || 0) + 1
		});
	}

	function deleteItem() {
		const { parentRoute, thisIndex } = getIndex();
		mainTree.deleteItem(parentRoute || '', thisIndex || 0);
	}

	function getIndex() {
		let thisRoute = itemClone?.route.split('/') || [];
		let thisIndex = parseInt(<string>thisRoute?.pop()) || 0;
		let parentRoute = thisRoute.join('/');
		return {
			thisRoute: thisRoute,
			thisIndex: thisIndex,
			parentRoute: parentRoute
		};
	}

	function submitChanges() {
		if (itemClone?.type == 'zone') {
			evalZone(itemClone);
		}

		if (itemClone?.type == 'act') {
			evalAct(itemClone);
		}
	}

	function evalZone(zoneClone: App.Zone) {
		const zName = normalizeTxtSingleLine(zoneClone.name);
		const zFactStr = evalFloat(`${zoneClone.factor}`);

		if (!zName || !zFactStr) return;

		const clean: App.Zone = {
			id: zoneClone.id,
			type: 'zone',
			name: zName,
			route: zoneClone.route,
			open: zoneClone.open,
			factor: parseFloat(zFactStr || ''),
			sum: zoneClone.sum,
			sumfactor: zoneClone.sumfactor,
			color: zoneClone.color,
			children: zoneClone.children
		};

		for (const key in clean) {
			// @ts-ignore --- tu q vasa ber d la bida mijo
			itemData[key] = clean[key];
		}

		if (!setColor && itemData?.type == 'zone') {
			delete itemData.color;
		}

		mainTree.rebuild();
		selectedId.set('');
	}

	function evalAct(actClone: App.Activity) {
		const aName = normalizeTxtSingleLine(actClone.name);
		const aArea = evalFloat(`${actClone.area}`);

		if (!aName || !aArea) return;

		const clean: App.Activity = {
			id: actClone.id,
			type: 'act',
			route: actClone.route,
			name: aName,
			area: parseFloat(aArea || '')
		};

		for (const key in clean) {
			// @ts-ignore --- tu q vasa ber d la bida mijo
			itemData[key] = clean[key];
		}

		mainTree.rebuild();
		selectedId.set('');
	}
</script>

<div>
	{#if itemClone}
		<div
			class="panel radius"
			transition:slide|local={{ duration: speedMs }}
			on:introend={focusInput}
		>
			<div class="header">
				<div class="title">Edit: {itemClone.id}</div>
			</div>
			<FormStyle on:submit={submitChanges}>
				<label class="flex-col">
					<span>Name:</span>
					<input type="text" class="unit" bind:value={itemClone.name} bind:this={inputName} />
				</label>

				{#if itemClone.type == 'zone'}
					<label class="flex-col">
						<span>Factor:</span>
						<input type="text" class="unit" bind:value={itemClone.factor} />
					</label>
					<label class="row">
						<input type="checkbox" bind:checked={setColor} />
						<span>Color</span>
					</label>
					{#if setColor}
						<div class="row">
							<input type="color" class="unit" bind:value={itemClone.color} />
						</div>
					{/if}
				{/if}

				{#if itemClone.type == 'act'}
					<label class="flex-col">
						<span>Area:</span>
						<input type="text" class="unit" bind:value={itemClone.area} />
					</label>
				{/if}

				<div class="btn-group" style="width: 100%;">
					{#if itemClone.route && itemClone.route !== '0'}
						<div style="flex-grow: 1;">
							<ConfirmButton on:confirm={deleteItem}>
								<Trash2 size={iconSize} />
							</ConfirmButton>
						</div>
						<div style="flex-grow: 1;">
							<button type="button" on:click={duplicateItem}>
								<Copy size={iconSize} />
							</button>
						</div>
					{/if}
					<div style="flex-grow: 1;">
						<button type="button" on:click={() => selectedId.set('')}>
							<X size={iconSize} />
						</button>
					</div>
					<div style="flex-grow: 1;">
						<button type="submit" class="unit">
							<Check size={iconSize} />
						</button>
					</div>
				</div>
			</FormStyle>
		</div>
	{/if}
</div>

<style>
	.flex-col {
		display: flex;
		flex-direction: column;
		width: 100%;
		flex-wrap: wrap;
		flex-grow: 1;
	}
	.flex-col input {
		/* width: auto; */
		width: 160px;
	}
</style>
