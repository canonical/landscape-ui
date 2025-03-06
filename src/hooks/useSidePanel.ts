import { useContext } from "react";
import { SidePanelContext } from "@/context/sidePanel";

export default function useSidePanel() {
  return useContext(SidePanelContext);
}
