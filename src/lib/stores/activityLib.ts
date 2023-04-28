import { get, writable } from 'svelte/store';

export const actIds = writable(<App.ActivityClass['id'][]>[]);



const actsLibStore = writable(<App.ActivityClass[]>[]);

function initActsLib() {

	const { subscribe, set, update } = actsLibStore

	return {
		subscribe,

		loadLibrary: (lib: App.ActivityClass[]) => {
			/* EVALUAR INPUT DE CLIENTE */
			/* ======================== */
			set(lib);
			update(actL => {
				// updateRoutesAndSyncIds(actL);
				return actL;
			})
		},

		addActivity: (newAct: App.NewActivityClass) => {

			if (!newAct?.name) return;
			if (newAct?.area === undefined) return;

			update(actL => {
				let setItem: App.ActivityClass = {
					id: newActId(),
					name: newAct.name,
					area: newAct.area > 0 ? Math.round((+newAct.area + Number.EPSILON) * 100) / 100 : 0
				}

				actL.unshift(setItem);

				// updateRoutesAndSyncIds(actL);
				return actL;
			})
		},

		// editItem: (map: App.TargetSingleMap) => update(n => n + 1),

		deleteActivity: (id: App.ActivityClass['id']) => {
			update(actL => {

				//... SELECT ACTIVITY BY ID

				// Remove item from 'from' list
				// actL.splice(targetIndex, 1);

				// updateRoutesAndSyncIds(actL);
				return actL;
			})
		},

		rebuild: () => update(actL => {
			// updateRoutesAndSyncIds(actL);
			return actL;
		})
	}
}

export const activityLib = initActsLib();



/* HELPERS */

function updateRoutesAndSyncIds(mainTree: App.Zone) {
	actIds.set([]);
	// deepRecurse(mainTree);
}

function newActId(): string {

	let tmpId: string = '';

	tmpId = makeId('ac.', 5);

	if (get(actIds).includes(tmpId)) {
		return newActId();
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

function duplicatedId(list: App.Zone['children'], id: string) {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id == id) return true;
	}
	return false;
}
