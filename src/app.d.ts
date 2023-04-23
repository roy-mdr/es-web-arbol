// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}

		interface Zone {
			id: string;
			type: 'zone';
			name: string;
			route: string;
			children: (Zone | Activity)[];
		}

		interface NewZone {
			name: string;
		}

		interface Activity {
			id: string;
			type: 'act';
			name: string;
		}

		interface NewActivity {
			name: string;
		}

		interface MoveSingleMap {
			from_list: Zone['route'];
			from_index: number;
			to_list: Zone['route'];
			to_index: number;
		}
	}

	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'map'?: string;
		}
	}
}

export { };
