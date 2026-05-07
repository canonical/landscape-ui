import type { HandlerDataConsole } from '../types-hoist/instrument';
/**
 * Add an instrumentation handler for when a console.xxx method is called.
 * Returns a function to remove the handler.
 *
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */
export declare function addConsoleInstrumentationHandler(handler: (data: HandlerDataConsole) => void): () => void;
//# sourceMappingURL=console.d.ts.map