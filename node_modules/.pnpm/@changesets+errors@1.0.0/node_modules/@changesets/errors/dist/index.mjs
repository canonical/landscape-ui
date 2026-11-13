//#region src/index.ts
var GitError = class extends Error {
	code;
	constructor(code, message) {
		super(`${message}, exit code: ${code}`);
		this.code = code;
	}
};
var ExitError = class extends Error {
	code;
	constructor(code, options) {
		super(`The process exited with code: ${code}`, options);
		this.code = code;
	}
};
var PreExitButNotInPreModeError = class extends Error {
	constructor() {
		super("pre mode cannot be exited when not in pre mode");
	}
};
var PreEnterButInPreModeError = class extends Error {
	constructor() {
		super("pre mode cannot be entered when in pre mode");
	}
};
var InternalError = class extends Error {
	constructor(message) {
		super(message);
	}
};
//#endregion
export { ExitError, GitError, InternalError, PreEnterButInPreModeError, PreExitButNotInPreModeError };
