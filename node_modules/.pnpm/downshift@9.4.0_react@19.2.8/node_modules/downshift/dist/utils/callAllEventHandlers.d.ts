/**
 * This is intended to be used to compose event handlers.
 * They are executed in order until one of them sets
 * `event.preventDownshiftDefault = true`.
 * @param fns the event handler functions
 * @return the event handler to add to an element
 */
export declare function callAllEventHandlers(...fns: (Function | undefined)[]): (event: React.SyntheticEvent & {
    preventDownshiftDefault?: boolean;
    nativeEvent: {
        preventDownshiftDefault?: boolean;
    };
}, ...args: unknown[]) => boolean;
