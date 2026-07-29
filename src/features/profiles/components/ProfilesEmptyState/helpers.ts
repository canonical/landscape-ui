import { ProfileTypes } from "../../helpers";
import {
  getDefaultProfilesDocumentationUrl,
  REPOSITORY_PROFILES_DOCUMENTATION_URL,
  USG_PROFILES_DOCUMENTATION_URL,
  WSL_PROFILES_DOCUMENTATION_URL,
} from "./constants";

export const getMessage = (type: ProfileTypes) => {
  switch (type) {
    case ProfileTypes.package:
      return "Package profiles let you manage how packages should exist on associated instances by defining constraints such as dependencies or conflicts between packages.";
    case ProfileTypes.repository:
      return "Repository profiles let you define which software repositories are available to associated instances, controlling where packages and updates are retrieved from.";
    case ProfileTypes.reboot:
      return "Reboot profiles let you schedule and manage automatic reboots across associated instances. Regular reboots keep your system healthy and secure by applying the latest updates. They also help maintain Livepatch coverage.";
    case ProfileTypes.removal:
      return "Removal profiles let you automatically remove client instances from Landscape that haven't communicated with the Landscape server in a specified number of days. This helps Landscape keep license seats open and avoid tracking stale or retired data for long periods of time.";
    case ProfileTypes.script:
      return "Script profiles let you automate your script runs based on triggers. Triggers can be either a recurring schedule, on a set date, or after enrollment.";
    case ProfileTypes.usg:
      return "Add a USG profile to ensure security and compliance across your instances. USG profile audits aggregate audit results over time and in bulk, helping you align with tailored security benchmarks, run scheduled audits, and generate detailed audits for your estate.";
    case ProfileTypes.upgrade:
      return "Upgrade profiles let you schedule when upgrades should be automatically installed on associated instances.";
    case ProfileTypes.wsl:
      return "WSL profiles let you define configuration settings for WSL instances created on associated Windows hosts. You must have a Windows host machine registered with Landscape before making any WSL instances.";
  }
};

export const getLink = (type: ProfileTypes) => {
  switch (type) {
    case ProfileTypes.repository:
      return REPOSITORY_PROFILES_DOCUMENTATION_URL;
    case ProfileTypes.usg:
      return USG_PROFILES_DOCUMENTATION_URL;
    case ProfileTypes.wsl:
      return WSL_PROFILES_DOCUMENTATION_URL;
    default:
      return getDefaultProfilesDocumentationUrl(type);
  }
};
