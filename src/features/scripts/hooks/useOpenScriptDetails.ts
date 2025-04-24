import { useEffect } from "react";
import { useLocation } from "react-router";
import { useGetSingleScript } from "../api";
import type { Script } from "../types";

export default function useOpenScriptDetails(
  handleScriptDetailsOpen: (script: Script) => void,
) {
  const { state }: { state: { scriptId?: number } } = useLocation();
  const scriptId = state?.scriptId || 0;

  const { script } = useGetSingleScript(scriptId, {
    enabled: !!scriptId,
  });

  useEffect(() => {
    if (!scriptId || !script) {
      return;
    }

    handleScriptDetailsOpen(script);
    window.history.replaceState({}, "");
  }, [scriptId, script]);
}
