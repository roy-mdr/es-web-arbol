<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import clickOutside from '$lib/util/clickOutside';

	const dispatch = createEventDispatcher();

	export let time = 2000;

	let confirmAction = false;
	let abortTimeout: NodeJS.Timeout;

	function onButtonClick() {
		if (confirmAction) {
			reset();
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

	function reset() {
		clearTimeout(abortTimeout);
		confirmAction = false;
	}
</script>

<div class="confirm-button" style={$$restProps.style} use:clickOutside on:click_outside={reset}>
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
