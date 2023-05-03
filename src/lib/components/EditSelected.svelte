<script lang="ts">
	import { slide } from 'svelte/transition';

	import { mainTree } from '$lib/stores/mainTree';
	import { selectedId, prepareDelete } from '$lib/stores/appState';
	import { speedMs } from '$lib/stores/appConstants';

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
		if (!$selectedId) {
			prepareDelete.set('');
			return;
		}
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
		if ($prepareDelete == $selectedId) {
			// Delete item
			console.log('delete', $selectedId);
			const { parentRoute, thisIndex } = getIndex();
			mainTree.deleteItem(parentRoute || '', thisIndex || 0);
			prepareDelete.set('');
		} else {
			console.log('prepare', $selectedId);
			prepareDelete.set($selectedId);
		}
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
		for (const key in itemClone) {
			// @ts-ignore --- tu q vasa ber d la bida mijo
			itemData[key] = itemClone[key];
		}
		if (!setColor && itemData?.type == 'zone') {
			delete itemData.color;
		}
		mainTree.rebuild();
		selectedId.set('');
	}
</script>

{#if itemClone}
	<div class="panel radius" transition:slide|local={{ duration: speedMs }} on:introend={focusInput}>
		<div class="header">
			<div class="title">Edit: {itemClone.id}</div>
		</div>
		<form on:submit|preventDefault={submitChanges}>
			<label>
				Name:
				<input type="text" bind:value={itemClone.name} bind:this={inputName} />
			</label>

			{#if itemClone.type == 'zone'}
				<label>
					Factor:
					<input type="text" bind:value={itemClone.factor} />
				</label>
				<label>
					Color:
					<input type="checkbox" bind:checked={setColor} />
				</label>
				{#if setColor}
					<label>
						Set Color:
						<input type="color" bind:value={itemClone.color} />
					</label>
				{/if}
			{/if}

			{#if itemClone.type == 'act'}
				<label>
					Area:
					<input type="text" bind:value={itemClone.area} />
				</label>
			{/if}

			<div>
				<button type="submit">Save</button>
				<button type="button" on:click={duplicateItem}>Duplicate</button>
				<button type="button" on:click={() => selectedId.set('')}>Cancel</button>
				{#if itemClone.route && itemClone.route !== '0'}
					<button type="button" on:click={deleteItem} class:sure={($selectedId = $prepareDelete)}
						>Delete</button
					>
				{/if}
			</div>
		</form>
	</div>
{/if}

<style>
	.sure {
		background-color: var(--cancel);
	}
</style>
