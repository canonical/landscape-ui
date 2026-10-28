//#region src/index.d.ts
declare class GitError extends Error {
  code: number;
  constructor(code: number, message: string);
}
declare class ExitError extends Error {
  code: number;
  constructor(code: number, options?: {
    cause?: Error;
  });
}
declare class PreExitButNotInPreModeError extends Error {
  constructor();
}
declare class PreEnterButInPreModeError extends Error {
  constructor();
}
declare class InternalError extends Error {
  constructor(message: string);
}
//#endregion
export { ExitError, GitError, InternalError, PreEnterButInPreModeError, PreExitButNotInPreModeError };