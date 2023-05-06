// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}

		interface ActivityClass {
			id: string;
			name: string;
			area: number;
			keywords: string;
		}

		interface NewActivityClass {
			name: string;
			area: number;
		}

		interface Zone {
			id: string;
			type: 'zone';
			name: string;
			route: string;
			open: boolean;
			factor: number;
			sum: number;
			color?: string;
			sumfactor: number;
			children: (Zone | Activity)[];
		}

		interface NewZone {
			name: string;
			factor?: number;
			color?: string;
		}

		interface Activity {
			id: string;
			type: 'act';
			route: string;
			name: string;
			area: number;
		}

		interface NewActivity {
			name: string;
			area: number;
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

	declare namespace svelte.JSX {
		interface HTMLAttributes<T> {
			onclick_outside: () => void
		}
	}
}

export { };
