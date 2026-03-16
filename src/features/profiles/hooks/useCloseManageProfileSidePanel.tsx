import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";

export const useCloseManageProfileSidePanel = () => {
  const { createPageParamsSetter } = usePageParams();
  const { closeSidePanel } = useSidePanel();

  return () => {
    createPageParamsSetter({ sidePath: [], profile: "" });
    closeSidePanel();
  };
};
