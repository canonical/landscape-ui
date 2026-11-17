/**
 * Returns both the item and index when both or either is passed.
 *
 * @param itemProp The item which could be undefined.
 * @param indexProp The index which could be undefined.
 * @param items The array of items to get the item based on index.
 * @param errorMessage The error to be thrown if index and item could not be returned for any reason.
 * @returns An array with item and index.
 */
export declare function getItemAndIndex<Item>(itemProp: Item | undefined, indexProp: number | undefined, items: Item[], errorMessage: string): [Item, number];
