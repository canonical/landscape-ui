import PropTypes from 'prop-types';
export declare const propTypes: {
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
