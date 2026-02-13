export function getInitialState(props: any): {
    inputValue: unknown;
    highlightedIndex: any;
    isOpen: unknown;
    selectedItem: unknown;
};
/**
 * The useCombobox version of useControlledReducer, which also
 * checks if the controlled prop selectedItem changed between
 * renders. If so, it will also update inputValue with its
 * string equivalent. It uses the common useEnhancedReducer to
 * compute the rest of the state.
 *
 * @param {Function} reducer Reducer function from downshift.
 * @param {Object} props The hook props, also passed to createInitialState.
 * @param {Function} createInitialState Function that returns the initial state.
 * @param {Function} isStateEqual Function that checks if a previous state is equal to the next.
 * @returns {Array} An array with the state and an action dispatcher.
 */
export function useControlledReducer(reducer: Function, props: Object, createInitialState: Function, isStateEqual: Function): any[];
export const propTypes: {
    items: PropTypes.Validator<any[]>;
    isItemDisabled: PropTypes.Requireable<(...args: any[]) => any>;
    inputValue: PropTypes.Requireable<string>;
    defaultInputValue: PropTypes.Requireable<string>;
    initialInputValue: PropTypes.Requireable<string>;
    inputId: PropTypes.Requireable<string>;
    onInputValueChange: PropTypes.Requireable<(...args: any[]) => any>;
    getA11yStatusMessage: PropTypes.Requireable<(...args: any[]) => any>;
    highlightedIndex: PropTypes.Requireable<number>;
    defaultHighlightedIndex: PropTypes.Requireable<number>;
    initialHighlightedIndex: PropTypes.Requireable<number>;
    isOpen: PropTypes.Requireable<boolean>;
    defaultIsOpen: PropTypes.Requireable<boolean>;
    initialIsOpen: PropTypes.Requireable<boolean>;
    selectedItem: PropTypes.Requireable<any>;
    initialSelectedItem: PropTypes.Requireable<any>;
    defaultSelectedItem: PropTypes.Requireable<any>;
    id: PropTypes.Requireable<string>;
    labelId: PropTypes.Requireable<string>;
    menuId: PropTypes.Requireable<string>;
    getItemId: PropTypes.Requireable<(...args: any[]) => any>;
    toggleButtonId: PropTypes.Requireable<string>;
    onSelectedItemChange: PropTypes.Requireable<(...args: any[]) => any>;
    onHighlightedIndexChange: PropTypes.Requireable<(...args: any[]) => any>;
    onStateChange: PropTypes.Requireable<(...args: any[]) => any>;
    onIsOpenChange: PropTypes.Requireable<(...args: any[]) => any>;
    scrollIntoView: PropTypes.Requireable<(...args: any[]) => any>;
    environment: PropTypes.Requireable<PropTypes.InferProps<{
        addEventListener: PropTypes.Validator<(...args: any[]) => any>;
        removeEventListener: PropTypes.Validator<(...args: any[]) => any>;
        document: PropTypes.Validator<NonNullable<PropTypes.InferProps<{
            createElement: PropTypes.Validator<(...args: any[]) => any>;
            getElementById: PropTypes.Validator<(...args: any[]) => any>;
            activeElement: PropTypes.Validator<any>;
            body: PropTypes.Validator<any>;
        }>>>;
        Node: PropTypes.Validator<(...args: any[]) => any>;
    }>>;
    itemToKey: PropTypes.Requireable<(...args: any[]) => any>;
    stateReducer: PropTypes.Requireable<(...args: any[]) => any>;
};
export const defaultProps: {
    isItemDisabled(): boolean;
    itemToString(item: unknown): string;
    itemToKey(item: unknown): unknown;
    stateReducer: typeof import("../utils-ts").stateReducer;
    scrollIntoView: typeof import("../../utils-ts").scrollIntoView;
    environment: (Window & typeof globalThis) | undefined;
};
import PropTypes from "prop-types";
