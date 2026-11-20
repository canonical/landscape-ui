import AppTabs from "@/components/AppTabs";
import type { FC } from "react";
import type { AutoinstallFileTabId } from "../../types";
import type { AutoinstallFile } from "../../types/AutoinstallFile";
import AutoinstallFileInfo from "../AutoinstallFileInfo";
import AutoinstallFileVersionHistory from "../AutoinstallFileVersionHistory";

interface AutoinstallFileTabsProps {
  readonly file: AutoinstallFile;
  readonly viewVersionHistory: () => void;
}

const AutoinstallFileTabs: FC<AutoinstallFileTabsProps> = ({
  file,
  viewVersionHistory,
}) => (
  <AppTabs<AutoinstallFileTabId>
    aria-label="Autoinstall file details"
    slot="panel"
    items={[
      {
        id: "info",
        label: "Info",
        panel: <AutoinstallFileInfo file={file} />,
      },
      {
        id: "version-history",
        label: "Version history",
        panel: (
          <AutoinstallFileVersionHistory
            file={file}
            viewVersionHistory={viewVersionHistory}
          />
        ),
      },
    ]}
  />
);

export default AutoinstallFileTabs;
