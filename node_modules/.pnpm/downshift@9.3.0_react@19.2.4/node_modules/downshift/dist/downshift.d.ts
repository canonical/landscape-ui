export default Downshift;
declare class Downshift extends Component<any, any, any> {
    static propTypes: {
        children: PropTypes.Requireable<(...args: any[]) => any>;
        defaultHighlightedIndex: PropTypes.Requireable<number>;
        defaultIsOpen: PropTypes.Requireable<boolean>;
        initialHighlightedIndex: PropTypes.Requireable<number>;
        initialSelectedItem: PropTypes.Requireable<any>;
        initialInputValue: PropTypes.Requireable<string>;
        initialIsOpen: PropTypes.Requireable<boolean>;
        getA11yStatusMessage: PropTypes.Requireable<(...args: any[]) => any>;
        itemToString: PropTypes.Requireable<(...args: any[]) => any>;
        onChange: PropTypes.Requireable<(...args: any[]) => any>;
        onSelect: PropTypes.Requireable<(...args: any[]) => any>;
        onStateChange: PropTypes.Requireable<(...args: any[]) => any>;
        onInputValueChange: PropTypes.Requireable<(...args: any[]) => any>;
        onUserAction: PropTypes.Requireable<(...args: any[]) => any>;
        onOuterClick: PropTypes.Requireable<(...args: any[]) => any>;
        selectedItemChanged: PropTypes.Requireable<(...args: any[]) => any>;
        stateReducer: PropTypes.Requireable<(...args: any[]) => any>;
        itemCount: PropTypes.Requireable<number>;
        id: PropTypes.Requireable<string>;
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
        suppressRefError: PropTypes.Requireable<boolean>;
        scrollIntoView: PropTypes.Requireable<(...args: any[]) => any>;
        selectedItem: PropTypes.Requireable<any>;
        isOpen: PropTypes.Requireable<boolean>;
        inputValue: PropTypes.Requireable<string>;
        highlightedIndex: PropTypes.Requireable<number>;
        labelId: PropTypes.Requireable<string>;
        inputId: PropTypes.Requireable<string>;
        menuId: PropTypes.Requireable<string>;
        getItemId: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        defaultHighlightedIndex: null;
        defaultIsOpen: boolean;
        getA11yStatusMessage: typeof getA11yStatusMessage;
        itemToString: (i: any) => string;
        onStateChange: typeof noop;
        onInputValueChange: typeof noop;
        onUserAction: typeof noop;
        onChange: typeof noop;
        onSelect: typeof noop;
        onOuterClick: typeof noop;
        selectedItemChanged: (prevItem: any, item: any) => boolean;
        environment: (Window & typeof globalThis) | undefined;
        stateReducer: (state: any, stateToSet: any) => any;
        suppressRefError: boolean;
        scrollIntoView: typeof scrollIntoView;
    };
    static stateChangeTypes: typeof stateChangeTypes;
    constructor(props: any);
    state: Object;
    id: any;
    menuId: any;
    labelId: any;
    inputId: any;
    getItemId: any;
    items: any[];
    itemCount: null;
    previousResultCount: number;
    timeoutIds: any[];
    /**
     * @param {Function} fn the function to call after the time
     * @param {Number} time the time to wait
     */
    internalSetTimeout: (fn: Function, time: number) => void;
    /**
     * Clear all running timeouts
     */
    internalClearTimeouts(): void;
    /**
     * Gets the state based on internal state or props
     * If a state value is passed via props, then that
     * is the value given, otherwise it's retrieved from
     * stateToMerge
     *
     * @param {Object} stateToMerge defaults to this.state
     * @return {Object} the state
     */
    getState(stateToMerge?: Object): Object;
    getItemCount(): number;
    setItemCount: (count: any) => void;
    unsetItemCount: () => void;
    getItemNodeFromIndex(index: any): any;
    isItemDisabled: (_item: any, index: any) => any;
    setHighlightedIndex: (highlightedIndex?: any, otherStateToSet?: {}) => void;
    scrollHighlightedItemIntoView(): void;
    moveHighlightedIndex(amount: any, otherStateToSet: any): void;
    clearSelection: (cb: any) => void;
    selectItem: (item: any, otherStateToSet: any, cb: any) => void;
    selectItemAtIndex: (itemIndex: any, otherStateToSet: any, cb: any) => void;
    selectHighlightedItem: (otherStateToSet: any, cb: any) => void;
    internalSetState: (stateToSet: any, cb: any) => void;
    getStateAndHelpers(): {
        getRootProps: ({ refKey, ref, ...rest }?: {
            refKey?: string | undefined;
            ref: any;
        }, { suppressRefError }?: {
            suppressRefError?: boolean | undefined;
        }) => {
            role: string;
            'aria-expanded': any;
            'aria-haspopup': string;
            'aria-owns': any;
            'aria-labelledby': any;
        };
        getToggleButtonProps: ({ onClick, onPress, onKeyDown, onKeyUp, onBlur, ...rest }?: {
            onClick: any;
            onPress: any;
            onKeyDown: any;
            onKeyUp: any;
            onBlur: any;
        }) => {
            type: string;
            role: string;
            'aria-label': string;
            'aria-haspopup': boolean;
            'data-toggle': boolean;
        };
        getLabelProps: (props: any) => any;
        getMenuProps: ({ refKey, ref, ...props }?: {
            refKey?: string | undefined;
            ref: any;
        }, { suppressRefError }?: {
            suppressRefError?: boolean | undefined;
        }) => {
            role: string;
            'aria-labelledby': any;
            id: any;
        };
        getInputProps: ({ onKeyDown, onBlur, onChange, onInput, onChangeText, ...rest }?: {
            onKeyDown: any;
            onBlur: any;
            onChange: any;
            onInput: any;
            onChangeText: any;
        }) => {
            'aria-autocomplete': string;
            'aria-activedescendant': any;
            'aria-controls': any;
            'aria-labelledby': any;
            autoComplete: string;
            value: any;
            id: any;
        };
        getItemProps: ({ onMouseMove, onMouseDown, onClick, onPress, index, item, ...rest }?: {
            onMouseMove: any;
            onMouseDown: any;
            onClick: any;
            onPress: any;
            index: any;
            item?: void | undefined;
        }) => {
            onMouseMove: Function;
            onMouseDown: Function;
            id: any;
            role: string;
            'aria-selected': boolean;
        } | {
            onMouseDown: Function;
            id: any;
            role: string;
            'aria-selected': boolean;
        };
        reset: (otherStateToSet: {} | undefined, cb: any) => void;
        openMenu: (cb: any) => void;
        closeMenu: (cb: any) => void;
        toggleMenu: (otherStateToSet: {} | undefined, cb: any) => void;
        selectItem: (item: any, otherStateToSet: any, cb: any) => void;
        selectItemAtIndex: (itemIndex: any, otherStateToSet: any, cb: any) => void;
        selectHighlightedItem: (otherStateToSet: any, cb: any) => void;
        setHighlightedIndex: (highlightedIndex?: any, otherStateToSet?: {}) => void;
        clearSelection: (cb: any) => void;
        clearItems: () => void;
        setItemCount: (count: any) => void;
        unsetItemCount: () => void;
        setState: (stateToSet: any, cb: any) => void;
        itemToString: any;
        id: any;
        highlightedIndex: any;
        inputValue: any;
        isOpen: any;
        selectedItem: any;
    };
    rootRef: (node: any) => any;
    _rootNode: any;
    getRootProps: ({ refKey, ref, ...rest }?: {
        refKey?: string | undefined;
        ref: any;
    }, { suppressRefError }?: {
        suppressRefError?: boolean | undefined;
    }) => {
        role: string;
        'aria-expanded': any;
        'aria-haspopup': string;
        'aria-owns': any;
        'aria-labelledby': any;
    };
    keyDownHandlers: {
        ArrowDown(event: any): void;
        ArrowUp(event: any): void;
        Enter(event: any): void;
        Escape(event: any): void;
    };
    buttonKeyDownHandlers: {
        ' '(event: any): void;
        ArrowDown(event: any): void;
        ArrowUp(event: any): void;
        Enter(event: any): void;
        Escape(event: any): void;
    };
    inputKeyDownHandlers: {
        Home(event: any): void;
        End(event: any): void;
        ArrowDown(event: any): void;
        ArrowUp(event: any): void;
        Enter(event: any): void;
        Escape(event: any): void;
    };
    getToggleButtonProps: ({ onClick, onPress, onKeyDown, onKeyUp, onBlur, ...rest }?: {
        onClick: any;
        onPress: any;
        onKeyDown: any;
        onKeyUp: any;
        onBlur: any;
    }) => {
        type: string;
        role: string;
        'aria-label': string;
        'aria-haspopup': boolean;
        'data-toggle': boolean;
    };
    buttonHandleKeyUp: (event: any) => void;
    buttonHandleKeyDown: (event: any) => void;
    buttonHandleClick: (event: any) => void;
    buttonHandleBlur: (event: any) => void;
    getLabelProps: (props: any) => any;
    getInputProps: ({ onKeyDown, onBlur, onChange, onInput, onChangeText, ...rest }?: {
        onKeyDown: any;
        onBlur: any;
        onChange: any;
        onInput: any;
        onChangeText: any;
    }) => {
        'aria-autocomplete': string;
        'aria-activedescendant': any;
        'aria-controls': any;
        'aria-labelledby': any;
        autoComplete: string;
        value: any;
        id: any;
    };
    inputHandleKeyDown: (event: any) => void;
    inputHandleChange: (event: any) => void;
    inputHandleBlur: () => void;
    menuRef: (node: any) => void;
    _menuNode: any;
    getMenuProps: ({ refKey, ref, ...props }?: {
        refKey?: string | undefined;
        ref: any;
    }, { suppressRefError }?: {
        suppressRefError?: boolean | undefined;
    }) => {
        role: string;
        'aria-labelledby': any;
        id: any;
    };
    getItemProps: ({ onMouseMove, onMouseDown, onClick, onPress, index, item, ...rest }?: {
        onMouseMove: any;
        onMouseDown: any;
        onClick: any;
        onPress: any;
        index: any;
        item?: void | undefined;
    }) => {
        onMouseMove: Function;
        onMouseDown: Function;
        id: any;
        role: string;
        'aria-selected': boolean;
    } | {
        onMouseDown: Function;
        id: any;
        role: string;
        'aria-selected': boolean;
    };
    avoidScrolling: boolean | undefined;
    clearItems: () => void;
    reset: (otherStateToSet: {} | undefined, cb: any) => void;
    toggleMenu: (otherStateToSet: {} | undefined, cb: any) => void;
    openMenu: (cb: any) => void;
    closeMenu: (cb: any) => void;
    updateStatus: Function;
    componentDidMount(): void;
    cleanup: (() => void) | (() => void) | undefined;
    isMouseDown: boolean | undefined;
    isTouchMove: boolean | undefined;
    shouldScroll(prevState: any, prevProps: any): any;
    componentDidUpdate(prevProps: any, prevState: any): void;
    componentWillUnmount(): void;
    render(): any;
}
import { Component } from "react";
import PropTypes from "prop-types";
import { getA11yStatusMessage } from "./utils";
import { noop } from "./utils-ts";
import { scrollIntoView } from "./utils-ts";
import * as stateChangeTypes from "./stateChangeTypes";
