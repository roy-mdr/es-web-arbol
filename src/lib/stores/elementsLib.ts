import { get, writable } from 'svelte/store';

export const elIds = writable(<App.ElementClass['id'][]>[]);



const elsLibStore = writable(<App.ElementClass[]>[]);

function initElmtsLib() {

	const { subscribe, set, update } = elsLibStore

	return {
		subscribe,

		loadLibrary: (lib: App.ElementClass[]) => {
			/* EVALUATE CLIENT INPUT */
			/* ===================== */
			set(lib);
			update(elmtL => {
				// updateRoutesAndSyncIds(elmtL);
				return elmtL;
			})
		},

		addElement: (newEl: App.NewElementClass) => {

			if (!newEl?.name) return;

			update(elmtL => {
				let setItem: App.ElementClass = {
					id: newElId(),
					name: newEl.name
				}

				elmtL.unshift(setItem);

				// updateRoutesAndSyncIds(elmtL);
				return elmtL;
			})
		},

		// editItem: (map: App.TargetSingleMap) => update(n => n + 1),

		deleteElement: (id: App.ElementClass['id']) => {
			update(elmtL => {

				//... SELECT ELEMENT BY ID

				// Remove item from 'from' list
				// elmtL.splice(targetIndex, 1);

				// updateRoutesAndSyncIds(elmtL);
				return elmtL;
			})
		},

		rebuild: () => update(elmtL => {
			// updateRoutesAndSyncIds(elmtL);
			return elmtL;
		})
	}
}

export const elementLib = initElmtsLib();



/* HELPERS */

function updateRoutesAndSyncIds(mainTree: App.Group) {
	elIds.set([]);
	// deepRecurse(mainTree);
}

function newElId(): string {

	let tmpId: string = '';

	tmpId = makeId('ac.', 5);

	if (get(elIds).includes(tmpId)) {
		return newElId();
	} else {
		return tmpId;
	}
}

function makeId(prefix = '', length = 5): string {
	let result = prefix;
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function duplicatedId(list: App.Group['children'], id: string) {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id == id) return true;
	}
	return false;
}
