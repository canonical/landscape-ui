import type { FC } from "react";
import type { SupportSettingSlug } from "../../constants";
import SupportAccessGroups from "./SupportAccessGroups";
import SupportAdministrators from "./SupportAdministrators";
import SupportGeneralSettings from "./SupportGeneralSettings";
import SupportRoles from "./SupportRoles";

interface SupportSettingsProps {
  readonly setting: SupportSettingSlug;
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
  }
};

export default SupportSettings;
