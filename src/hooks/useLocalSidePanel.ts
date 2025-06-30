import { LocalSidePanelContext } from "@/context/localSidePanel/localSidePanel";
import { useContext } from "react";

export default function useLocalSidePanel() {
  return useContext(LocalSidePanelContext);
}
