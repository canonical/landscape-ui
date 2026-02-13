import PropTypes from 'prop-types';
export declare const propTypes: {
    items: PropTypes.Validator<any[]>;
    isItemDisabled: PropTypes.Requireable<(...args: any[]) => any>;
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
