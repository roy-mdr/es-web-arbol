import { get, writable, derived } from 'svelte/store';
import { appLocalStorage } from '$lib/util/storageMgmt';
import { normalizeTxtSingleLine, eliminarDiacriticosEs, evalFloat } from '$lib/util/normalizeTxt';

export const actIds = writable(<App.ActivityClass['id'][]>[]);



const actsLibStore = writable(<App.ActivityClass[]>[]);

function initActsLib() {

	const localData = appLocalStorage.get('actLib');
	if (localData) {
		actsLibStore.set(JSON.parse(localData));
	}

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
			});

			saveLocalData();
		},

		selectById: (id: App.ActivityClass['id']) => {
			const store = get(actsLibStore);
			for (let i = 0; i < store.length; i++) {
				if (store[i].id == id) {
					return store[i];
				}
			}
		},

		addActivity: (newAct: App.NewActivityClass) => {

			if (!newAct?.name) return;
			if (newAct?.area === undefined) return;

			const cleanName = normalizeTxtSingleLine(newAct.name)
			if (!cleanName) return;
			const cleanAreaStr = evalFloat(`${newAct.area}`)
			if (!cleanAreaStr) return;

			const floatArea = parseFloat(cleanAreaStr);

			update(actL => {
				let setItem: App.ActivityClass = {
					id: newActId(),
					name: cleanName,
					area: floatArea > 0 ? Math.round((+floatArea + Number.EPSILON) * 100) / 100 : 0,
					keywords: eliminarDiacriticosEs(cleanName.toLowerCase())
				}

				actL.unshift(setItem);

				updateRoutesAndSyncIds(actL);
				return actL;
			});

			saveLocalData();
		},

		// editItem: (map: App.TargetSingleMap) => update(n => n + 1),

		deleteActivity: (id: App.ActivityClass['id']) => {
			update(actL => {
				let itemIndex: number | undefined;

				actL.forEach((el, ix) => {
					if (el.id == id) {
						itemIndex = ix;
					}
				})

				// Remove item from 'from' list
				if (itemIndex !== undefined) {
					actL.splice(itemIndex, 1);
				}

				updateRoutesAndSyncIds(actL);
				return actL;
			});

			saveLocalData();
		},

		rebuild: () => {
			update(actL => {
				// updateRoutesAndSyncIds(actL);
				return actL;
			});

			saveLocalData();
		}
	}
}

export const activityLib = initActsLib();



export const activityLibFilterTerm = writable('');
export const activityLibFiltered = derived(
	[activityLibFilterTerm, actsLibStore],
	([$activityLibFilterTerm, $actsLibStore]) => {
		return $actsLibStore.filter((item) => {
			return item.keywords.includes(
				eliminarDiacriticosEs(normalizeTxtSingleLine($activityLibFilterTerm.toLowerCase()))
			);
		});
	}
);



/* HELPERS */

function updateRoutesAndSyncIds(actLib: App.ActivityClass[]) {
	actIds.set([]);
	deepRecurse();
}

function deepRecurse() {

	const existingIds: App.ActivityClass['id'][] = [];

	get(actsLibStore).forEach((el, ix, arr) => {
		// Push id to store
		existingIds.push(el.id);
	});

	actIds.set(existingIds);

}

function saveLocalData() {
	appLocalStorage.set('actLib', JSON.stringify(get(actsLibStore)));
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
