<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Upload, Save, FilePlus2, Boxes, Home } from 'lucide-svelte';
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
	<div class="btn-group">
		<div>
			<button
				type="button"
				on:click={() => {
					dispatch('change-view', 'editor');
				}}
			>
				<Home size={iconSize} /> Editor
			</button>
		</div>
		<div>
			<button
				type="button"
				on:click={() => {
					dispatch('change-view', 'sunburst');
				}}
			>
				<Boxes size={iconSize} /> Sunflare
			</button>
		</div>
		<div>
			<button
				type="button"
				on:click={() => {
					dispatch('change-view', 'sized-tree');
				}}
			>
				<Boxes size={iconSize} /> Sized-Tree
			</button>
		</div>
	</div>
</div>

<style>
	.actions {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-half);
	}
</style>
