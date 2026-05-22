import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import type { AutoinstallFileTabId } from "../../types";
import type { AutoinstallFile } from "../../types/AutoinstallFile";
import AutoinstallFileInfo from "../AutoinstallFileInfo";
import AutoinstallFileVersionHistory from "../AutoinstallFileVersionHistory";
import classes from "./AutoinstallFIleTabs.module.scss";
import { AUTOINSTALL_FILE_TABS } from "./constants";

interface AutoinstallFileTabsProps {
  readonly file: AutoinstallFile;
  readonly viewVersionHistory: () => void;
  readonly onInfoTabClick: () => void;
  readonly activeTabId?: AutoinstallFileTabId;
}

const AutoinstallFileTabs: FC<AutoinstallFileTabsProps> = ({
  file,
  viewVersionHistory,
  onInfoTabClick,
  activeTabId = "info",
}) => {
  const links = AUTOINSTALL_FILE_TABS.map(({ label, id }) => ({
    label,
    active: id === activeTabId,
    role: "tab",
    onClick: (): void => {
      if (id === "version-history") {
        viewVersionHistory();
      } else {
        onInfoTabClick();
      }
    },
  }));

  return (
    <>
      <Tabs listClassName={classes.tabs} links={links} />

      {activeTabId === "info" && <AutoinstallFileInfo file={file} />}

      {activeTabId === "version-history" && (
        <AutoinstallFileVersionHistory
          file={file}
          viewVersionHistory={viewVersionHistory}
        />
      )}
    </>
  );
};

export default AutoinstallFileTabs;

//   return (
//     <>
//       <Tabs listClassName={classes.tabs} links={links} />

//       {tabId === "info" && <AutoinstallFileInfo file={file} />}

//       {tabId === "version-history" && (
//         <AutoinstallFileVersionHistory
//           file={file}
//           viewVersionHistory={viewVersionHistory}
//         />
//       )}
//     </>
//   );
// };

// export default AutoinstallFileTabs;
