declare global {
	interface Window {
		$: JQueryStatic;
	}

	interface String {
		toNumber(): number;
	}

	interface Error {
		toJSON(): Object;
	}

	interface Array<T> {
		random(): T;
	}

	interface HTMLButtonElement {
		disable(): this;
		enable(): this;
	}

	interface StringConstructor {
		random(size?: number): string;
	}
}

export {};
