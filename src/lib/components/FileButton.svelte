<script lang="ts">
	export let files: FileList;
	export let name: string;
	let elemFileInput: HTMLElement;

	function onButtonClick() {
		elemFileInput.click();
	}

	function prunedRestProps() {
		delete $$restProps.class;
		return $$restProps;
	}
</script>

<div class="file-button" style={$$restProps.style}>
	<!-- NOTE: Don't use `hidden` as it prevents `required` from operating -->
	<div class="hide">
		<input
			type="file"
			bind:this={elemFileInput}
			bind:files
			{name}
			{...prunedRestProps()}
			on:change
		/>
	</div>
	<!-- Button -->
	<button
		type="button"
		class="file-button-btn"
		disabled={$$restProps.disabled}
		style={$$restProps.style}
		on:click={onButtonClick}
		on:keydown
		on:keyup
		on:keypress
	>
		<slot>Select a File</slot>
	</button>
</div>

<style>
	.hide {
		width: 0;
		height: 0;
		overflow: hidden;
	}
</style>
