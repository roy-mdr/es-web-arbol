<script lang="ts">
	import { onMount } from 'svelte';
	import Zone from '../lib/components/Zone.svelte';

	onMount(() => {
		rebuildTree();
	});

	let treeData = {
		id: 'z-0',
		type: 'zone',
		name: 'sistema',
		route: '',
		children: [
			{
				id: 'a-7',
				type: 'act',
				name: 'takata'
			},
			{
				id: 'z-1',
				type: 'zone',
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
	};

	function moveItem(moveMap: any) {
		console.log(moveMap);
		const fromList = getList(moveMap.from_list);
		const toList = getList(moveMap.to_list);

		// Copy item to 'to' list
		toList.splice(moveMap.to_index, 0, fromList[moveMap.from_index]);
		// Remove item from 'from' list
		fromList.splice(moveMap.from_index, 1);

		// Update all
		rebuildTree();
	}

	function getList(map: string) {
		const route = map.split('/');
		let currentList: any = treeData.children;

		route.shift(); // Ignore first item (home route)

		for (let ix = 0; ix < route.length; ix++) {
			currentList = currentList[route[ix]].children;
		}

		return currentList;
	}

	function makeRoutes(root: any, map: string = '0') {
		console.log('rebuilding');
		root.route = map;

		root.children?.forEach((el: any, ix: number) => {
			makeRoutes(el, `${map}/${ix}`);
		});
		// root.children = root.children;
		/*
		if (root.children) {
			for (let ix = 0; ix < root.children.length; ix++) {
				makeRoutes(root.children[ix], `${map}/${ix}`);
			}
			root.children = root.children;
		}
		*/
	}

	function rebuildTree() {
		makeRoutes(treeData);
		treeData = treeData;
	}

	$: dataAsJSON = JSON.stringify(treeData.children, null, 2);
</script>

<div style="display: flex;">
	<Zone
		{...treeData}
		mainTree={true}
		on:main-tree-update={rebuildTree}
		on:move-item={(ev) => moveItem(ev.detail)}
	/>

	<pre>
{dataAsJSON}
	</pre>
</div>
