import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetScriptProfile } from "../../api";
import type { ScriptProfile } from "../../types";

export interface ScriptProfileSidePanelComponentProps {
  scriptProfile: ScriptProfile;
}

interface ScriptProfileSidePanelProps {
  readonly Component: FC<ScriptProfileSidePanelComponentProps>;
}

const ScriptProfileSidePanel: FC<ScriptProfileSidePanelProps> = ({
  Component,
}) => {
  const { scriptProfile: scriptProfileId } = usePageParams();

  const { isGettingScriptProfile, scriptProfile, scriptProfileError } =
    useGetScriptProfile({ id: scriptProfileId });

  if (isGettingScriptProfile) {
    return <SidePanel.LoadingState />;
  }

  if (!scriptProfile) {
    throw scriptProfileError;
  } else {
    return <Component scriptProfile={scriptProfile} />;
  }
};

export default ScriptProfileSidePanel;
