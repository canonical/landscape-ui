export default useMultipleSelection;
declare function useMultipleSelection(userProps?: {}): {
    getSelectedItemProps: ({ refKey, ref, onClick, onKeyDown, selectedItem: selectedItemProp, index: indexProp, ...rest }?: {
        refKey?: string | undefined;
        ref: any;
        onClick: any;
        onKeyDown: any;
        selectedItem: any;
        index: any;
    }) => {
        tabIndex: number;
        onClick: Function;
        onKeyDown: Function;
    };
    getDropdownProps: ({ refKey, ref, onKeyDown, onClick, preventKeyAction, ...rest }?: {
        refKey?: string | undefined;
        ref: any;
        onKeyDown: any;
        onClick: any;
        preventKeyAction?: boolean | undefined;
    }, { suppressRefError }?: {
        suppressRefError?: boolean | undefined;
    }) => {
        onKeyDown?: Function | undefined;
        onClick?: Function | undefined;
    };
    addSelectedItem: (selectedItem: any) => void;
    removeSelectedItem: (selectedItem: any) => void;
    setSelectedItems: (newSelectedItems: any) => void;
    setActiveIndex: (newActiveIndex: any) => void;
    reset: () => void;
    selectedItems: any;
    activeIndex: any;
};
declare namespace useMultipleSelection {
    export { stateChangeTypes };
}
import * as stateChangeTypes from "./stateChangeTypes";
