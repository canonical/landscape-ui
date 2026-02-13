/**
 * Accepts a parameter and returns it if it's a function
 * or a noop function if it's not. This allows us to
 * accept a callback, but not worry about it if it's not
 * passed.
 * @param {Function} cb the callback
 * @return {Function} a function
 */
export function cbToCb(cb: Function): Function;
/**
 * This is intended to be used to compose event handlers.
 * They are executed in order until one of them sets
 * `event.preventDownshiftDefault = true`.
 * @param {...Function} fns the event handler functions
 * @return {Function} the event handler to add to an element
 */
export function callAllEventHandlers(...fns: Function[]): Function;
export function handleRefs(...refs: any[]): (node: any) => void;
/**
 * Simple debounce implementation. Will call the given
 * function once after the time given has passed since
 * it was last called.
 * @param {Function} fn the function to call after the time
 * @param {Number} time the time to wait
 * @return {Function} the debounced function
 */
export function debounce(fn: Function, time: number): Function;
/**
 * Default implementation for status message. Only added when menu is open.
 * Will specify if there are results in the list, and if so, how many,
 * and what keys are relevant.
 *
 * @param {Object} param the downshift state and other relevant properties
 * @return {String} the a11y status message
 */
export function getA11yStatusMessage({ isOpen, resultCount, previousResultCount }: Object): string;
/**
 * Takes an argument and if it's an array, returns the first item in the array
 * otherwise returns the argument
 * @param {*} arg the maybe-array
 * @param {*} defaultValue the value if arg is falsey not defined
 * @return {*} the arg or it's first item
 */
export function unwrapArray(arg: any, defaultValue: any): any;
/**
 * @param {Object} element (P)react element
 * @return {Boolean} whether it's a DOM element
 */
export function isDOMElement(element: Object): boolean;
/**
 * @param {Object} element (P)react element
 * @return {Object} the props
 */
export function getElementProps(element: Object): Object;
/**
 * Throws a helpful error message for required properties. Useful
 * to be used as a default in destructuring or object params.
 * @param {String} fnName the function name
 * @param {String} propName the prop name
 */
export function requiredProp(fnName: string, propName: string): void;
/**
 * @param {Object} state the state object
 * @return {Object} state that is relevant to downshift
 */
export function pickState(state?: Object): Object;
/**
 * Simple check if the value passed is object literal
 * @param {*} obj any things
 * @return {Boolean} whether it's object literal
 */
export function isPlainObject(obj: any): boolean;
/**
 * Normalizes the 'key' property of a KeyboardEvent in IE/Edge
 * @param {Object} event a keyboardEvent object
 * @return {String} keyboard key
 */
export function normalizeArrowKey(event: Object): string;
/**
 * Checks if event target is within the downshift elements.
 *
 * @param {EventTarget} target Target to check.
 * @param {HTMLElement[]} downshiftElements The elements that form downshift (list, toggle button etc).
 * @param {Window} environment The window context where downshift renders.
 * @param {boolean} checkActiveElement Whether to also check activeElement.
 *
 * @returns {boolean} Whether or not the target is within downshift elements.
 */
export function targetWithinDownshift(target: EventTarget, downshiftElements: HTMLElement[], environment: Window, checkActiveElement?: boolean): boolean;
/**
 * This determines whether a prop is a "controlled prop" meaning it is
 * state which is controlled by the outside of this component rather
 * than within this component.
 *
 * @param {Object} props The props that may contain controlled values.
 * @param {String} key the key to check
 * @return {Boolean} whether it is a controlled controlled prop
 */
export function isControlledProp(props: Object, key: string): boolean;
export let validateControlledUnchanged: typeof noop;
/**
 * Returns the next non-disabled highlightedIndex value.
 *
 * @param {number} start The current highlightedIndex.
 * @param {number} offset The offset from the current highlightedIndex to start searching.
 * @param {unknown[]} items The items array.
 * @param {(item: unknown, index: number) => boolean} isItemDisabled Function that tells if an item is disabled or not.
 * @param {boolean?} circular If the search reaches the end, if it can search again starting from the other end.
 * @returns {number} The next highlightedIndex.
 */
export function getHighlightedIndex(start: number, offset: number, items: unknown[], isItemDisabled: (item: unknown, index: number) => boolean, circular?: boolean | null): number;
/**
 * Returns the next non-disabled highlightedIndex value.
 *
 * @param {number} start The current highlightedIndex.
 * @param {boolean} backwards If true, it will search backwards from the start.
 * @param {unknown[]} items The items array.
 * @param {(item: unknown, index: number) => boolean} isItemDisabled Function that tells if an item is disabled or not.
 * @param {boolean} circular If the search reaches the end, if it can search again starting from the other end.
 * @returns {number} The next non-disabled index.
 */
export function getNonDisabledIndex(start: number, backwards: boolean, items: unknown[], isItemDisabled: (item: unknown, index: number) => boolean, circular?: boolean): number;
import { noop } from "./utils-ts";
