export declare const defaultProps: {
    isItemDisabled(): boolean;
    itemToString(item: unknown): string;
    itemToKey(item: unknown): unknown;
    stateReducer: typeof import("../../utils-ts").stateReducer;
    scrollIntoView: typeof import("../../../utils-ts").scrollIntoView;
    environment: (Window & typeof globalThis) | undefined;
};
