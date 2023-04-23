<script lang="ts">
	import { mainTree } from '$lib/stores/mainTree';

	function newMainTree() {
		mainTree.newMainTree('Sistema solar bb 8)');
	}

	function loadMainTree() {
		mainTree.loadMainTree({
			id: 'z.HCFEO',
			type: 'zone',
			route: '',
			name: 'Sistema solar bb 8)',
			children: [
				{
					id: 'z.r943a',
					type: 'zone',
					name: 'nop',
					route: '',
					children: [
						{
							id: 'z.r943b',
							type: 'zone',
							name: 'nop',
							route: '',
							children: [
								{
									id: 'a._0Bla',
									type: 'act',
									name: 'nop'
								}
							]
						}
					]
				},
				{
					id: 'z.r943E',
					type: 'zone',
					name: 'nop',
					route: '',
					children: []
				},
				{
					id: 'a._0Bln',
					type: 'act',
					name: 'nop'
				},
				{
					id: 'z.S9V74',
					type: 'zone',
					name: 'nop',
					route: '',
					children: []
				},
				{
					id: 'a.PCzLA',
					type: 'act',
					name: 'nop'
				}
			]
		});
	}

	function addZone() {
		mainTree.addZone('0', 1, {
			name: 'nop'
		});
	}

	function addActivity() {
		mainTree.addActivity('0/0', 1, {
			name: 'nop'
		});
	}

	function moveItem() {
		mainTree.moveItem({
			from_list: '0/0',
			from_index: 0,
			to_list: '0/1',
			to_index: 3
		});
	}

	function copyItem() {
		mainTree.copyItem({
			from_list: '0/0',
			from_index: 0,
			to_list: '0/1',
			to_index: 3
		});
	}

	$: test = JSON.stringify($mainTree, undefined, 2);
</script>

<div>
	<button type="button" on:click={newMainTree}>New Main Tree</button>
	<button type="button" on:click={loadMainTree}>Load Main Tree</button>
	<button type="button" on:click={addZone}>Add Zone</button>
	<button type="button" on:click={addActivity}>Add activity</button>
	<button type="button" on:click={moveItem}>Move item</button>
	<button type="button" on:click={copyItem}>Copy item</button>
</div>

<pre>
{test}
</pre>
