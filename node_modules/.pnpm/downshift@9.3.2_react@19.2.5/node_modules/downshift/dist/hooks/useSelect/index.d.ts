export default useSelect;
declare function useSelect(userProps?: {}): {
    getToggleButtonProps: ({ onBlur, onClick, onPress, onKeyDown, refKey, ref, ...rest }?: {
        onBlur: any;
        onClick: any;
        onPress: any;
        onKeyDown: any;
        refKey?: string | undefined;
        ref: any;
    }, { suppressRefError }?: {
        suppressRefError?: boolean | undefined;
    }) => {
        'aria-activedescendant': string;
        'aria-controls': string;
        'aria-expanded': any;
        'aria-haspopup': string;
        'aria-labelledby': string | undefined;
        id: string;
        role: string;
        tabIndex: number;
        onBlur: Function;
    };
    getLabelProps: ({ onClick, ...labelProps }?: {
        onClick: any;
    }) => {
        id: string;
        htmlFor: string;
        onClick: Function;
    };
    getMenuProps: ({ onMouseLeave, refKey, ref, ...rest }?: {
        onMouseLeave: any;
        refKey?: string | undefined;
        ref: any;
    }, { suppressRefError }?: {
        suppressRefError?: boolean | undefined;
    }) => {
        id: string;
        role: string;
        'aria-labelledby': string | undefined;
        onMouseLeave: Function;
    };
    getItemProps: ({ item: itemProp, index: indexProp, onMouseMove, onClick, onMouseDown, onPress, refKey, disabled: disabledProp, ref, ...rest }?: {
        item: any;
        index: any;
        onMouseMove: any;
        onClick: any;
        onMouseDown: any;
        onPress: any;
        refKey?: string | undefined;
        disabled: any;
        ref: any;
    }) => {
        'aria-disabled': boolean;
        'aria-selected': boolean;
        id: string;
        role: string;
    };
    toggleMenu: () => void;
    openMenu: () => void;
    closeMenu: () => void;
    setHighlightedIndex: (newHighlightedIndex: any) => void;
    selectItem: (newSelectedItem: any) => void;
    reset: () => void;
    setInputValue: (newInputValue: any) => void;
    highlightedIndex: any;
    isOpen: any;
    selectedItem: any;
    inputValue: any;
};
declare namespace useSelect {
    export { stateChangeTypes };
}
import * as stateChangeTypes from "./stateChangeTypes";
