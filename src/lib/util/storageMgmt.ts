export const appLocalStorage = {
	get: (key: string) => {
		if (typeof window == 'undefined') return;
		return window.localStorage.getItem(key);
	},

	set: (key: string, value: string) => {
		if (typeof window == 'undefined') return;
		return window.localStorage.setItem(key, value);
	},

	remove: (key: string) => {
		if (typeof window == 'undefined') return;
		return window.localStorage.removeItem(key);
	},

	clear: () => {
		if (typeof window == 'undefined') return;
		return window.localStorage.clear();
	},

	keyAtIndex: (index: number) => {
		if (typeof window == 'undefined') return;
		return window.localStorage.key(index);
	},

	len: () => {
		if (typeof window == 'undefined') return;
		return window.localStorage.length;
	}
}
