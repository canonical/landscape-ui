/**
 * Simple debounce implementation. Will call the given
 * function once after the time given has passed since
 * it was last called.
 */
export declare function debounce(fn: Function, time: number): Function & {
    cancel: Function;
};
