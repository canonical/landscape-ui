type UseElementIdsProps = {
    id?: string;
    labelId?: string;
    menuId?: string;
    getItemId?: (index: number) => string;
    toggleButtonId?: string;
    inputId?: string;
};
type UseElementIdsReturnValue = {
    labelId: string;
    menuId: string;
    getItemId: (index: number) => string;
    toggleButtonId: string;
    inputId: string;
};
export declare const useElementIds: typeof useElementIdsR18;
declare function useElementIdsR18({ id, labelId, menuId, getItemId, toggleButtonId, inputId, }: UseElementIdsProps): UseElementIdsReturnValue;
export {};
