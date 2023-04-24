<script lang="ts">
	import { mainTree, mtIds } from '$lib/stores/mainTree';

	function newMainTree() {
		mainTree.newMainTree('Sistema solar bb 8)');
	}

	function loadMainTree_1() {
		mainTree.loadMainTree({
			id: 'z.HCFEO',
			type: 'zone',
			open: true,
			route: '',
			name: 'Sistema solar bb 8)',
			children: [
				{
					id: 'z.r943a',
					type: 'zone',
					open: false,
					name: 'nop',
					route: '',
					children: [
						{
							id: 'z.r943b',
							type: 'zone',
							open: true,
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
					open: true,
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
					open: true,
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

	function loadMainTree_2() {
		mainTree.loadMainTree({
			id: 'z-0',
			type: 'zone',
			open: true,
			route: '',
			name: 'sistema',
			children: [
				{
					id: 'a-7',
					type: 'act',
					name: 'takata'
				},
				{
					id: 'z-1',
					type: 'zone',
					open: true,
					route: '',
					name: 'social',
					children: [
						{
							id: 'a-1',
							type: 'act',
							name: 'convivir'
						},
						{
							id: 'z-2',
							type: 'zone',
							open: false,
							route: '',
							name: 'social intima',
							children: [
								{
									id: 'a-2',
									type: 'act',
									name: 'convivir 2'
								},
								{
									id: 'a-6',
									type: 'act',
									name: 'convivir 3'
								},
								{
									id: 'a-1',
									type: 'act',
									name: 'convivir 4'
								}
							]
						}
					]
				},
				{
					id: 'a-3',
					type: 'act',
					name: 'a'
				},
				{
					id: 'a-4',
					type: 'act',
					name: 'b'
				},
				{
					id: 'a-5',
					type: 'act',
					name: 'c'
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
			from_index: 1,
			to_list: '0/0',
			to_index: 0
		});
	}

	function copyItem() {
		mainTree.copyItem({
			from_list: '0/0',
			from_index: 0,
			to_list: '0/0',
			to_index: 1
		});
	}

	$: test = JSON.stringify($mainTree, undefined, 2);
</script>

<a href="/">Go to Interactive Tree</a>

<div>
	<button type="button" on:click={newMainTree}>New Main Tree</button>
	<button type="button" on:click={loadMainTree_1}>Load Tree #1</button>
	<button type="button" on:click={loadMainTree_2}>Load Tree #2</button>
	<button type="button" on:click={addZone}>Add Zone</button>
	<button type="button" on:click={addActivity}>Add activity</button>
	<button type="button" on:click={moveItem}>Move item</button>
	<button type="button" on:click={copyItem}>Copy item</button>
</div>

<div style="display: flex;">
	<pre>
{test}
	</pre>

	<pre>
{$mtIds}
	</pre>
</div>
