type GetItemIndexByCharacterKeyOptions<Item> = {
    keysSoFar: string;
    highlightedIndex: number;
    items: Item[];
    itemToString(item: Item | null): string;
    isItemDisabled(item: Item, index: number): boolean;
};
export declare function getItemIndexByCharacterKey<Item>({ keysSoFar, highlightedIndex, items, itemToString, isItemDisabled, }: GetItemIndexByCharacterKeyOptions<Item>): number;
export {};
