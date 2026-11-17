/**
 * This generates a unique ID for an instance of Downshift
 * @return {string} the unique ID
 */
export declare function generateId(): string;
/**
 * This is only used in tests
 * @param {number} num the number to set the idCounter to
 */
export declare function setIdCounter(num: number): void;
/**
 * Resets idCounter to 0. Used for SSR.
 */
export declare function resetIdCounter(): void;
