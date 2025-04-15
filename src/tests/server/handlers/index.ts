import savedSearches from "@/tests/server/handlers/savedSearches";
import script from "@/tests/server/handlers/script";
import accessGroup from "./accessGroup";
import activity from "./activity";
import alerts from "./alerts";
import aptSource from "./aptSource";
import auth from "./auth";
import oidcIssuers from "./oidcIssuers";
import availabilityZones from "./availabilityZones";
import distributions from "./distributions";
import employeeGroups from "./employeeGroups";
import eventsLog from "./eventsLog";
import gpgKey from "./gpgKey";
import instance from "./instance";
import organisationPreferences from "./organisationPreferences";
import packageProfile from "./packageProfile";
import packages from "./packages";
import pockets from "./pockets";
import process from "./process";
import repo from "./repo";
import securityProfiles from "./securityProfiles";
import snap from "./snap";
import tag from "./tag";
import upgradeProfile from "./upgradeProfile";
import user from "./user";
import userSettings from "./userSettings";
import usn from "./usn";
import wsl from "./wsl";
import employees from "./employees";
import autoinstallFiles from "./autoinstallFiles";

export default [
  ...accessGroup,
  ...autoinstallFiles,
  ...activity,
  ...alerts,
  ...aptSource,
  ...auth,
  ...oidcIssuers,
  ...availabilityZones,
  ...distributions,
  ...employees,
  ...employeeGroups,
  ...eventsLog,
  ...gpgKey,
  ...instance,
  ...organisationPreferences,
  ...packageProfile,
  ...packages,
  ...pockets,
  ...process,
  ...repo,
  ...savedSearches,
  ...securityProfiles,
  ...script,
  ...snap,
  ...tag,
  ...upgradeProfile,
  ...user,
  ...userSettings,
  ...usn,
  ...wsl,
];
