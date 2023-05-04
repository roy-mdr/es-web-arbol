<script lang="ts">
	import { Plus } from 'lucide-svelte';

	import { iconSize } from '$lib/stores/appConstants';
	import { activityLib } from '$lib/stores/activityLib';

	let inputName: HTMLElement;

	let newAct: App.NewActivityClass = {
		name: '',
		area: 0
	};

	function addActAndReset() {
		activityLib.addActivity(newAct);
		newAct = {
			name: '',
			area: 0
		};
		inputName.focus();
	}
</script>

<form on:submit|preventDefault={addActAndReset}>
	<input type="text" bind:value={newAct.name} bind:this={inputName} />
	<input type="text" bind:value={newAct.area} />
	<button type="submit">
		<Plus size={iconSize} />
	</button>
</form>
