export class Logger {
	private static debug = false;

	public static get Enabled() { return this.debug; }

	public static enable() { this.debug = true; }
	public static disable() { this.debug = false; }

	public static log(...args: unknown[]) {
		if (Logger.Enabled) {
			for (const arg of args) {
				console.log(arg);
			}
		}
	}

	public static info(...args: unknown[]) {
		if (Logger.Enabled) {
			for (const arg of args) {
				console.info(arg);
			}
		}
	}

	public static warn(...args: unknown[]) {
		if (Logger.Enabled) {
			for (const arg of args) {
				console.warn(arg);
			}
		}
	}

	public static error(...args: unknown[]) {
		if (Logger.Enabled) {
			for (const arg of args) {
				console.error(arg);
			}
		}
	}
}
