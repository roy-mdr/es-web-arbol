<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Upload, Save, FilePlus2, Boxes } from 'lucide-svelte';
	import FileButton from '$lib/components/FileButton.svelte';
	import ConfirmButton from '$lib/components/ConfirmButton.svelte';

	import { iconSize } from '$lib/stores/appConstants';

	const dispatch = createEventDispatcher();

	let loadFile: FileList;
</script>

<div class="actions">
	<div class="btn-group">
		<ConfirmButton
			on:confirm={() => {
				dispatch('new');
			}}
		>
			<FilePlus2 size={iconSize} />
		</ConfirmButton>
		<FileButton
			name="upload"
			accept=".systree"
			bind:files={loadFile}
			on:change={() => {
				dispatch('load', loadFile);
			}}
		>
			<Upload size={iconSize} />
		</FileButton>
		<div>
			<button
				type="button"
				on:click={() => {
					dispatch('save');
				}}
			>
				<Save size={iconSize} />
			</button>
		</div>
	</div>
	<div class="graph-links">
		<a href="./sunburst" target="_blank">
			<Boxes size={iconSize} /> Sunflare
		</a>
		<a href="./sized-tree" target="_blank">
			<Boxes size={iconSize} /> Sized-Tree
		</a>
	</div>
</div>

<style>
	.actions {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.graph-links a {
		color: var(--light-text);
		margin-left: var(--space-unit);
	}
</style>
