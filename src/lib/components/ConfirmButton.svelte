<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let time = 2000;

	let confirmAction = false;
	let abortTimeout: NodeJS.Timeout;

	function onButtonClick() {
		if (confirmAction) {
			clearTimeout(abortTimeout);
			confirmAction = false;
			dispatch('confirm');
		} else {
			confirmAction = true;

			abortTimeout = setTimeout(() => {
				confirmAction = false;
			}, time);
		}
	}

	function prunedRestProps() {
		delete $$restProps.class;
		return $$restProps;
	}
</script>

<div class="confirm-button" style={$$restProps.style}>
	<button
		type="button"
		class:confirm={confirmAction}
		{...prunedRestProps()}
		on:click={onButtonClick}
		on:keydown
		on:keyup
		on:keypress
	>
		<slot />
	</button>
</div>

<style>
	.confirm {
		background-color: var(--cancel) !important;
	}
</style>
