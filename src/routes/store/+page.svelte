<script lang="ts">
	import { mainTree, mtIds } from '$lib/stores/mainTree';

	function newMainTree() {
		mainTree.newMainTree('Sistema solar bb 8)');
	}

	function loadMainTree_1() {
		mainTree.loadMainTree({
			id: 'g.HCFEO',
			type: 'group',
			open: true,
			route: '',
			name: 'Sistema solar bb 8)',
			children: [
				{
					id: 'g.r943a',
					type: 'group',
					open: false,
					name: 'nop',
					route: '',
					children: [
						{
							id: 'g.r943b',
							type: 'group',
							open: true,
							name: 'nop',
							route: '',
							children: [
								{
									id: 'e._0Bla',
									type: 'element',
									name: 'nop',
									route: ''
								}
							]
						}
					]
				},
				{
					id: 'g.r943E',
					type: 'group',
					open: true,
					name: 'nop',
					route: '',
					children: []
				},
				{
					id: 'e._0Bln',
					type: 'element',
					name: 'nop',
					route: ''
				},
				{
					id: 'g.S9V74',
					type: 'group',
					open: true,
					name: 'nop',
					route: '',
					children: []
				},
				{
					id: 'e.PCzLA',
					type: 'element',
					name: 'nop',
					route: ''
				}
			]
		});
	}

	function loadMainTree_2() {
		mainTree.loadMainTree({
			id: 'z-0',
			type: 'group',
			open: true,
			route: '',
			name: 'sistema',
			children: [
				{
					id: 'a-7',
					type: 'element',
					name: 'takata',
					route: ''
				},
				{
					id: 'z-1',
					type: 'group',
					open: true,
					route: '',
					name: 'social',
					children: [
						{
							id: 'a-1',
							type: 'element',
							name: 'convivir',
							route: ''
						},
						{
							id: 'z-2',
							type: 'group',
							open: false,
							route: '',
							name: 'social intima',
							children: [
								{
									id: 'a-2',
									type: 'element',
									name: 'convivir 2',
									route: ''
								},
								{
									id: 'a-6',
									type: 'element',
									name: 'convivir 3',
									route: ''
								},
								{
									id: 'a-1',
									type: 'element',
									name: 'convivir 4',
									route: ''
								}
							]
						}
					]
				},
				{
					id: 'a-3',
					type: 'element',
					name: 'a',
					route: ''
				},
				{
					id: 'a-4',
					type: 'element',
					name: 'b',
					route: ''
				},
				{
					id: 'a-5',
					type: 'element',
					name: 'c',
					route: ''
				}
			]
		});
	}

	function addGroup() {
		mainTree.addGroup('0', 1, {
			name: 'nop'
		});
	}

	function addElement() {
		mainTree.addElement('0/0', 1, {
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
	<button type="button" on:click={addGroup}>Add Group</button>
	<button type="button" on:click={addElement}>Add element</button>
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
