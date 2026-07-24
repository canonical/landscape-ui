type UseElementIdsProps = {
    id?: string;
    tagGroupId?: string;
    getTagId?: (index: number) => string;
};
type UseElementIdsReturnValue = {
    tagGroupId: string;
    getTagId: (index: number) => string;
};
export declare const useElementIds: (props: UseElementIdsProps) => UseElementIdsReturnValue;
export {};
