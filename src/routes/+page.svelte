<script lang="ts">
	import { onMount } from 'svelte';
	import Zone from '$lib/components/Zone.svelte';

	onMount(() => {
		rebuildTree();
	});

	let mainTreeData: App.Zone = {
		id: 'z-0',
		type: 'zone',
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
	};

	function moveItem(moveMap: App.MoveMap) {
		const fromList = getList(moveMap.from_list);
		const toList = getList(moveMap.to_list);

		// Copy item to 'to' list
		toList.splice(moveMap.to_index, 0, fromList[moveMap.from_index]);
		// Remove item from 'from' list
		fromList.splice(moveMap.from_index, 1);

		// Update all
		rebuildTree();
	}

	function getList(zoneRoute: App.Zone['route']) {
		const route: string[] = zoneRoute.split('/');

		let currentZone: (App.Zone | App.Activity)[] = mainTreeData.children;

		route.shift(); // Ignore first item (home route)

		for (let ix = 0; ix < route.length; ix++) {
			// @ts-ignore // I guess I need conditional types... currentZone is a Zone bc the function that called getList read the value from a Zone
			currentZone = currentZone[parseInt(route[ix])].children;
		}

		return currentZone;
	}

	function makeRoutes(root: App.Zone, map: App.Zone['route'] = '0', reId: boolean = false) {
		if (root.type !== 'zone') {
			if (root.type == 'act') {
				if (reId) {
					root.id = `a-${Math.random()}`;
				}
				return;
			} else {
				return;
			}
		}

		if (reId) {
			root.id = `z-${Math.random()}`;
		}
		root.route = map;

		root.children?.forEach((el, ix) => {
			// @ts-ignore // I guess I need conditional types... El will be a Zone bc is after checking if .children exist en root...
			makeRoutes(el, `${map}/${ix}`, reId);
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

	function rebuildTree(reId: boolean = false) {
		makeRoutes(mainTreeData, undefined, reId);
		mainTreeData = mainTreeData;
	}

	$: dataAsJSON = JSON.stringify(mainTreeData.children, null, 2);
</script>

<div style="display: flex;">
	<Zone
		id={mainTreeData.id}
		name={mainTreeData.name}
		children={mainTreeData.children}
		route={mainTreeData.route}
		mainTree={true}
		on:main-tree-update={(e) => {
			rebuildTree(false);
		}}
		on:id-conflict={(e) => {
			rebuildTree(true);
		}}
		on:move-item={(ev) => moveItem(ev.detail)}
	/>

	<pre>
{dataAsJSON}
	</pre>
</div>
