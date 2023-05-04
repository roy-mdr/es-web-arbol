/** Dispatch event on click outside of node */
export default function clickOutside(node: HTMLElement) {

	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented) {
			node.dispatchEvent(
				new CustomEvent('click_outside', node as CustomEventInit)
			)
		}
		return true;
	}

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	}
}