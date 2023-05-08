<div class="wrapper">
	<form class="unit" on:submit|preventDefault {...$$restProps}>
		<slot />
	</form>
</div>

<style>
	.wrapper :global(.unit) {
		color: var(--main-text);
		background-color: var(--carpet);
		border: 1px solid var(--light);
		padding: var(--space-half) var(--space-unit);
		transition: background-color var(--speed-normal);
		border-radius: var(--radius-unit);
	}

	form :global(> *) {
		margin-bottom: var(--space-half);
	}

	form :global(> *:first-child) {
		margin-top: var(--space-half);
	}

	form :global(.row) {
		display: flex;
		width: 100%;
	}

	form :global(.row > *:not(:first-child)) {
		margin-left: var(--space-half);
	}

	form :global(input.unit) {
		width: 100%;
	}

	form :global(input.unit[type='range']),
	form :global(input.unit[type='color']) {
		padding: 0;
	}

	form :global(button.unit) {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	form :global(button.unit:hover) {
		background-color: var(--hint);
	}

	form :global(button.unit[type='submit']) {
		border-color: var(--accent);
	}

	form :global(button.unit[type='submit']:hover) {
		background-color: var(--accent);
	}
</style>
