import { scrollIntoView } from '../../utils-ts';
import { stateReducer } from '../utils-ts';
export declare const defaultProps: {
    itemToString(item: unknown): string;
    itemToKey(item: unknown): unknown;
    stateReducer: typeof stateReducer;
    scrollIntoView: typeof scrollIntoView;
    environment: (Window & typeof globalThis) | undefined;
};
