<script lang="ts">
	import { mainTree } from '$lib/stores/mainTree';
	import { selectedId } from '$lib/stores/appState';

	let parentRoute: App.Zone['route'] | undefined;
	let thisIndex: number | undefined;

	function getSelected(rootItem: App.Zone | App.Activity, id: App.Zone['id'] | App.Activity['id']) {
		parentRoute = undefined;
		thisIndex = undefined;
		return selectById(rootItem, id);
	}

	function selectById(
		rootItem: App.Zone | App.Activity,
		id: App.Zone['id'] | App.Activity['id']
	): App.Zone | App.Activity | undefined {
		if (rootItem.id == id) {
			let thisRoute = rootItem.route.split('/') || '';
			thisIndex = parseInt(<string>thisRoute?.pop()) || 0;
			parentRoute = thisRoute.join('/');

			return rootItem;
		} else {
			if (rootItem.type == 'zone') {
				// Use a for loop instead of forEach to avoid nested functions
				// Otherwise "return" will not work properly
				for (let i = 0; i < rootItem.children.length; i++) {
					// Search in the current child
					let innerSearch = selectById(rootItem.children[i], id);

					if (innerSearch) {
						let thisRoute = innerSearch.route.split('/') || '';
						thisIndex = parseInt(<string>thisRoute?.pop()) || 0;
						parentRoute = thisRoute.join('/');

						return innerSearch;
					}
				}
			}

			// The node has not been found and we have no more options
			return;
		}
	}

	$: itemData = getSelected($mainTree, $selectedId);
</script>

{#if itemData}
	<div class="panel">
		<div class="title">{itemData.id}</div>
		<form>
			<label>
				Name:
				<input type="text" bind:value={itemData.name} />
			</label>
			<div>
				<button type="button" on:click={() => mainTree.rebuild()}>Save</button>
				<button type="button" on:click={() => selectedId.set('')}>Cancel</button>
				{#if parentRoute}
					<button
						type="button"
						on:click={() => mainTree.deleteItem(parentRoute || '', thisIndex || 0)}>Delete</button
					>
				{/if}
			</div>
		</form>
	</div>
{/if}

<style>
	.panel {
		padding: 0.5em;
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 2px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
		margin: 0.5em;
	}

	.panel :global(.title) {
		font-weight: bold;
		background-color: rgba(0, 0, 0, 0.1);
		width: max-content;
		padding: 0 0.5em;
		border-radius: 2px;
	}
</style>
