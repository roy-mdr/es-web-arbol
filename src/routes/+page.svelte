<script lang="ts">
	import Zone from '$lib/components/Zone.svelte';

	import { mainTree } from '$lib/stores/mainTree';

	mainTree.loadMainTree({
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
	});

	$: dataAsJSON = JSON.stringify($mainTree, null, 2);
</script>

<div style="display: flex;">
	<Zone
		id={$mainTree.id}
		name={$mainTree.name}
		children={$mainTree.children}
		route={$mainTree.route}
		isMainTree={true}
	/>

	<pre>
{dataAsJSON}
	</pre>
</div>
