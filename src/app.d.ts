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

		interface Activity {
			id: string;
			type: 'act';
			name: string;
		}

		interface MoveMap {
			from_list: string;
			from_index: number;
			to_list: string;
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
