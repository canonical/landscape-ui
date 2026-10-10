import type { FC } from "react";
import SupportAccessGroups from "./SupportAccessGroups";
import SupportAdministrators from "./SupportAdministrators";
import SupportGeneralSettings from "./SupportGeneralSettings";
import SupportRoles from "./SupportRoles";

interface SupportSettingsProps {
  /** The `setting` route segment, one of `SUPPORT_SETTINGS_PAGES`. */
  readonly setting: string;
}

/** The read-only org settings page `setting` for the entered account. */
const SupportSettings: FC<SupportSettingsProps> = ({ setting }) => {
  switch (setting) {
    case "general":
      return <SupportGeneralSettings />;
    case "administrators":
      return <SupportAdministrators />;
    case "roles":
      return <SupportRoles />;
    case "access-groups":
      return <SupportAccessGroups />;
    default:
      return null;
  }
};

export default SupportSettings;
