import { get, writable } from 'svelte/store';

const defaultMainZone: App.Zone = {
	id: makeId('z.', 5),
	type: 'zone',
	route: '0',
	name: 'Main',
	children: []
}

let mainTreeStore = writable(defaultMainZone);

function initMainTree() {

	const { subscribe, set, update } = mainTreeStore

	return {
		subscribe,

		newMainTree: (name: string) => set({
			id: makeId('z.', 5),
			type: 'zone',
			route: '0',
			name: name,
			children: []
		}),

		loadMainTree: (mainTree: App.Zone) => {
			/* EVALUAR INPUT DE CLIENTE */
			/* ======================== */
			set(mainTree);
			update(mt => {
				makeRoutes(mt);
				return mt;
			})
		},

		addZone: (map: App.Zone['route'], targetIndex: number | undefined = undefined, newZone: App.NewZone) => {
			update(mt => {
				let setItem: App.Zone = {
					id: makeId('z.', 5),
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

				makeRoutes(mt);
				return mt;
			})
		},

		addActivity: (map: App.Zone['route'], targetIndex: number | undefined = undefined, newAct: App.NewActivity) => {
			update(mt => {
				let setItem: App.Activity = {
					id: makeId('a.', 5),
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

				makeRoutes(mt);
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

				const copyItem = fromList[map.from_index]

				if (!copyItem) {
					console.error('Origin item not found')
					return mt;
				}

				if (toList.length < map.to_index) {
					console.info('Target list smaller than target index. Appending to end.')
				}

				// Prevet duplicated id's in list
				if (duplicatedId(toList, copyItem.id)) {
					alert('Item already in list!');
					return mt;
				}

				// Copy item to 'to' list
				toList.splice(map.to_index, 0, copyItem);

				// Remove item from 'from' list
				fromList.splice(map.from_index, 1);

				makeRoutes(mt);
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
					console.info('Target list smaller than target index. Appending to end.')
				}

				if (copyItem.type == 'act') copyItem.id = makeId('a.', 5);
				if (copyItem.type == 'zone') makeRoutes(copyItem, true);

				// Prevet duplicated id's in list
				if (duplicatedId(toList, copyItem.id)) {
					alert('Item already in list!');
					return mt;
				}

				// Place item to 'to' list
				toList.splice(map.to_index, 0, copyItem);

				makeRoutes(mt);
				return mt;
			})
		},

		rebuild: () => update(mt => {
			makeRoutes(mt);
			return mt = mt
		})
	}
}

export const mainTree = initMainTree();



/* HELPERS */

function makeId(prefix = '', length = 0) {
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

	let currentZone: (App.Zone | App.Activity)[] = get(mainTreeStore).children;

	route.shift(); // Ignore first item (home route)

	for (let ix = 0; ix < route.length; ix++) {
		// @ts-ignore // I guess I need conditional types... currentZone is a Zone bc the function that called getList read the value from a Zone
		currentZone = currentZone[parseInt(route[ix])]?.children || undefined;
	}

	if (!currentZone) throw new Error(`Children of '${zoneRoute}' not found`);

	return currentZone;
}

function makeRoutes(root: App.Zone, reId: boolean = false, map: App.Zone['route'] = '0') {
	if (root.type !== 'zone') {
		if (root.type == 'act') {
			if (reId) {
				root.id = makeId('a.', 5);
			}
			return;
		} else {
			return;
		}
	}

	if (reId) {
		root.id = makeId('z.', 5);
	}
	root.route = map;
	if (root.children) {
		for (let ix = 0; ix < root.children.length; ix++) {
			makeRoutes(<App.Zone>root.children[ix], reId, `${map}/${ix}`);
		}
		root.children = root.children;
	}
}

function duplicatedId(list: App.Zone['children'], id: string) {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id == id) return true;
	}
	return false;
}
