<script lang="ts">
	import Zone from '../lib/components/Zone.svelte';

	let treeData = {
		type: 'zone',
		name: 'sistema',
		children: [
			{
				type: 'zone',
				name: 'social',
				children: [
					{
						type: 'act',
						name: 'convivir'
					},
					{
						type: 'zone',
						name: 'social intima',
						children: [
							{
								type: 'act',
								name: 'convivir 2'
							}
						]
					}
				]
			},
			{
				type: 'act',
				name: 'a'
			},
			{
				type: 'act',
				name: 'b'
			},
			{
				type: 'act',
				name: 'c'
			}
		]
	};
</script>

<Zone {...treeData} fixed={true} />
