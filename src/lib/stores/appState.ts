import { writable } from 'svelte/store';

export const ctrlKeyIsDown = writable(false);



function initDragNewAct() {

	const { subscribe, set, update } = writable();

	return {
		subscribe,

		setActData: (actData: App.ActivityClass) => set(actData),

		clear: () => set(undefined)
	}
}

export const dragNewActivity = initDragNewAct();
