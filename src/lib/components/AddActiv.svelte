<script lang="ts">
	import { activityLib } from '$lib/stores/activityLib';

	let inputName: HTMLElement;

	let newAct: App.NewActivityClass = {
		name: ''
	};

	function addActAndReset() {
		activityLib.addActivity(newAct);
		newAct = {
			name: ''
		};
		inputName.focus();
	}
</script>

<form on:submit|preventDefault={addActAndReset}>
	<input type="text" bind:value={newAct.name} bind:this={inputName} />
	<button type="submit">Add</button>
</form>
