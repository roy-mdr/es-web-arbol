import { get, writable } from 'svelte/store';

export const mtIds = writable(['z.0']);



const defaultMainZone: App.Zone = {
	id: 'z.0',
	type: 'zone',
	route: '0',
	name: 'Main',
	children: []
}

const mainTreeStore = writable(defaultMainZone);

function initMainTree() {

	const { subscribe, set, update } = mainTreeStore

	return {
		subscribe,

		newMainTree: (name: string) => {
			set({
				id: newMtId('zone'),
				type: 'zone',
				route: '0',
				name: name,
				children: []
			})
			update(mt => {
				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		loadMainTree: (mainTree: App.Zone) => {
			/* EVALUAR INPUT DE CLIENTE */
			/* ======================== */
			set(mainTree);
			update(mt => {
				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		addZone: (map: App.Zone['route'], targetIndex: number | undefined = undefined, newZone: App.NewZone) => {
			update(mt => {
				let setItem: App.Zone = {
					id: newMtId('zone'),
					type: 'zone',
					name: newZone.name,
					route: '',
					children: []
				}

				let toList: App.Zone['children'];
				try {
					toList = getZoneList(map);
				} catch (error: any) {
					console.error(error.message);
					return mt;
				}

				if (targetIndex !== undefined) {
					if (toList.length < targetIndex) {
						console.info('Target list smaller than target index. Appending to end.')
					}
					toList.splice(targetIndex, 0, setItem);
				} else {
					toList.push(setItem);
				}

				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		addActivity: (map: App.Zone['route'], targetIndex: number | undefined = undefined, newAct: App.NewActivity) => {
			update(mt => {
				let setItem: App.Activity = {
					id: newMtId('act'),
					type: 'act',
					name: newAct.name
				}

				let toList: App.Zone['children'];
				try {
					toList = getZoneList(map);
				} catch (error: any) {
					console.error(error.message);
					return mt;
				}

				if (targetIndex !== undefined) {
					if (toList.length < targetIndex) {
						console.info('Target list smaller than target index. Appending to end.')
					}
					toList.splice(targetIndex, 0, setItem);
				} else {
					toList.push(setItem);
				}

				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		// editItem: (map: App.TargetSingleMap) => update(n => n + 1),
		// deleteItem: (map: App.TargetSingleMap) => update(n => n + 1),

		moveItem: (map: App.MoveSingleMap) => {
			update(mt => {

				let fromList: App.Zone['children'];
				let toList: App.Zone['children'];

				try {
					fromList = getZoneList(map.from_list);
					toList = getZoneList(map.to_list);
				} catch (error: any) {
					console.error(error.message)
					return mt;
				}

				const movingItem = structuredClone(fromList[map.from_index]);

				if (!movingItem) {
					console.error('Origin item not found');
					return mt;
				}

				if (toList.length < map.to_index) {
					console.info('Target list smaller than target index. Appending to end.');
				}

				// Prevet duplicated id's in destiny list
				if ((fromList !== toList) && duplicatedId(toList, movingItem.id)) {
					console.error('Item id already in list? Creating a new one!');
					if (movingItem.type == 'act') movingItem.id = newMtId('act');
					if (movingItem.type == 'zone') movingItem.id = newMtId('zone');
				}

				// Remove item from 'from' list
				fromList.splice(map.from_index, 1);

				// Copy item to 'to' list
				toList.splice(map.to_index, 0, movingItem);

				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		copyItem: (map: App.MoveSingleMap) => {
			update(mt => {

				let fromList: App.Zone['children'];
				let toList: App.Zone['children'];

				try {
					fromList = getZoneList(map.from_list);
					toList = getZoneList(map.to_list);
				} catch (error: any) {
					console.error(error.message);
					return mt;
				}

				const copyItem = structuredClone(fromList[map.from_index]);

				if (!copyItem) {
					console.error('Origin item not found');
					return mt;
				}

				if (toList.length < map.to_index) {
					console.info('Target list smaller than target index. Appending to end.');
				}

				if (copyItem.type == 'act') copyItem.id = newMtId('act');
				if (copyItem.type == 'zone') deepRecurse(copyItem, { remakeRoutes: false, remakeIds: true });

				// Prevet duplicated id's in list
				if (duplicatedId(toList, copyItem.id)) {
					alert('Item already in list... That\'s weird... Contact support or something 🤣');
					return mt;
				}

				// Place item to 'to' list
				toList.splice(map.to_index, 0, copyItem);

				updateRoutesAndSyncIds(mt);

				//  ========== XDDD ========== //
				if (fromList === toList) {
					setTimeout(() => {
						mainTreeStore.set(defaultMainZone);
					}, 0);

					setTimeout(() => {
						mainTreeStore.set(mt);
					}, 0);
				}

				return mt;
			})
		},

		rebuild: () => update(mt => {
			updateRoutesAndSyncIds(mt);
			return mt;
		})
	}
}

export const mainTree = initMainTree();



/* HELPERS */

function updateRoutesAndSyncIds(mainTree: App.Zone) {
	mtIds.set([]);
	deepRecurse(mainTree);
}

function newMtId(itemType: App.Zone['type'] | App.Activity['type']): string {

	let tmpId: string = '';

	if (itemType == 'zone') tmpId = makeId('z.', 5);
	if (itemType == 'act') tmpId = makeId('a.', 5);

	if (tmpId == '') throw new Error(`Invalid type '${itemType}'`);

	if (get(mtIds).includes(tmpId)) {
		return newMtId(itemType);
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

function getZoneList(zoneRoute: App.Zone['route']) {
	const route: string[] = zoneRoute.split('/');

	let currentZone = get(mainTreeStore).children;

	route.shift(); // Ignore first item (home route)

	for (let ix = 0; ix < route.length; ix++) {
		// @ts-ignore // I guess I need conditional types... currentZone is a Zone bc the function that called getList read the value from a Zone
		currentZone = currentZone[parseInt(route[ix])]?.children || undefined;
	}

	if (!currentZone) throw new Error(`Children of '${zoneRoute}' not found`);

	return currentZone;
}

interface deepRecurseOptionsNoRoutes {
	remakeRoutes: false;
	remakeIds: boolean;
}

interface deepRecurseOptionsRoutes {
	remakeRoutes: true;
	initRoute: App.Zone['route'];
	remakeIds: boolean;
}

const deepRecurseDefaultOptions: deepRecurseOptionsRoutes = {
	remakeRoutes: true,
	initRoute: '0',
	remakeIds: false
}

function deepRecurse(root: App.Zone | App.Activity, options: deepRecurseOptionsNoRoutes | deepRecurseOptionsRoutes = deepRecurseDefaultOptions) {

	if (root.type == 'zone') {
		if (options.remakeIds) {
			root.id = newMtId('zone');
		}

		// Push id to store
		mtIds.update(ids => { ids.push(root.id); return ids; });

		if (options.remakeRoutes) {

			root.route = options.initRoute;

			// Recurse and pass new route to child
			for (let ix = 0; ix < root.children.length; ix++) {
				const newOptions = structuredClone(options);
				newOptions.initRoute = `${options.initRoute}/${ix}`;
				deepRecurse(<App.Zone>root.children[ix], newOptions);
			}
		} else {
			// Recurse as is
			for (let ix = 0; ix < root.children.length; ix++) {
				deepRecurse(<App.Zone>root.children[ix], options);
			}
		}
	}

	if (root.type == 'act') {
		if (options.remakeIds) {
			root.id = newMtId('act');
		}

		// Push id to store
		mtIds.update(ids => { ids.push(root.id); return ids; });
	}
}

function duplicatedId(list: App.Zone['children'], id: string) {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id == id) return true;
	}
	return false;
}
