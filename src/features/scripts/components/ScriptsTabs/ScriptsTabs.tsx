import AppTabs from "@/components/AppTabs";
import type { FC } from "react";
import { lazy } from "react";

const ScriptsPanel = lazy(async () => import("../ScriptsContainer"));
const ScriptProfilesTab = lazy(
  async () => import("@/features/script-profiles/components/ScriptProfilesTab"),
);

const ScriptsTabs: FC = () => (
  <AppTabs
    aria-label="Scripts"
    items={[
      { id: "scripts", label: "Scripts", panel: <ScriptsPanel /> },
      { id: "profiles", label: "Profiles", panel: <ScriptProfilesTab /> },
    ]}
  />
);

export default ScriptsTabs;
