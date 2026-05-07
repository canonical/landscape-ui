export namespace defaultProps {
    const itemToKey: (item: unknown) => unknown;
    const stateReducer: typeof import("../utils-ts").stateReducer;
    const environment: (Window & typeof globalThis) | undefined;
    const keyNavigationNext: string;
    const keyNavigationPrevious: string;
}
export let validatePropTypes: typeof noop;
/**
 * Returns the default value for a state key in the following order:
 * 1. controlled prop, 2. default prop, 3. default value from Downshift.
 *
 * @param {Object} props Props passed to the hook.
 * @param {string} propKey Props key to generate the value for.
 * @returns {any} The initial value for that prop.
 */
export function getDefaultValue(props: Object, propKey: string): any;
/**
 * Gets the initial state based on the provided props. It uses initial, default
 * and controlled props related to state in order to compute the initial value.
 *
 * @param {Object} props Props passed to the hook.
 * @returns {Object} The initial state.
 */
export function getInitialState(props: Object): Object;
/**
 * Returns true if dropdown keydown operation is permitted. Should not be
 * allowed on keydown with modifier keys (ctrl, alt, shift, meta), on
 * input element with text content that is either highlighted or selection
 * cursor is not at the starting position.
 *
 * @param {KeyboardEvent} event The event from keydown.
 * @returns {boolean} Whether the operation is allowed.
 */
export function isKeyDownOperationPermitted(event: KeyboardEvent): boolean;
/**
 * Check if a state is equal for taglist, by comparing active index and selected items.
 * Used by useSelect and useCombobox.
 *
 * @param {Object} prevState
 * @param {Object} newState
 * @returns {boolean} Wheather the states are deeply equal.
 */
export function isStateEqual(prevState: Object, newState: Object): boolean;
import { noop } from "../../utils-ts";
