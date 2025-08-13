import savedSearches from "@/tests/server/handlers/savedSearches";
import script from "@/tests/server/handlers/script";
import accessGroup from "./accessGroup";
import activity from "./activity";
import administrators from "./administrators";
import alerts from "./alerts";
import aptSource from "./aptSource";
import auth from "./auth";
import autoinstallFiles from "./autoinstallFiles";
import availabilityZones from "./availabilityZones";
import distributions from "./distributions";
import employees from "./employees";
import eventsLog from "./eventsLog";
import features from "./features";
import gpgKey from "./gpgKey";
import instance from "./instance";
import invitations from "./invitations";
import oidcIssuers from "./oidcIssuers";
import organisationPreferences from "./organisationPreferences";
import packageProfile from "./packageProfile";
import packages from "./packages";
import pockets from "./pockets";
import process from "./process";
import rebootProfiles from "./rebootProfiles";
import removalProfiles from "./removalProfiles";
import repo from "./repo";
import repositoryProfiles from "./repositoryProfiles";
import roles from "./roles";
import scriptProfiles from "./scriptProfiles";
import securityProfiles from "./securityProfiles";
import snap from "./snap";
import tag from "./tag";
import upgradeProfile from "./upgradeProfile";
import user from "./user";
import userSettings from "./userSettings";
import usn from "./usn";
import wsl from "./wsl";
import wslProfiles from "./wslProfiles";

export default [
  ...accessGroup,
  ...administrators,
  ...autoinstallFiles,
  ...activity,
  ...alerts,
  ...aptSource,
  ...auth,
  ...oidcIssuers,
  ...availabilityZones,
  ...distributions,
  ...employees,
  ...eventsLog,
  ...gpgKey,
  ...instance,
  ...invitations,
  ...organisationPreferences,
  ...packageProfile,
  ...packages,
  ...pockets,
  ...process,
  ...rebootProfiles,
  ...removalProfiles,
  ...repo,
  ...repositoryProfiles,
  ...roles,
  ...savedSearches,
  ...securityProfiles,
  ...script,
  ...scriptProfiles,
  ...snap,
  ...tag,
  ...upgradeProfile,
  ...user,
  ...userSettings,
  ...usn,
  ...wsl,
  ...wslProfiles,
  ...features,
];
