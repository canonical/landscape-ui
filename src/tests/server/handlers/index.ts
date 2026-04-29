import savedSearches from "@/tests/server/handlers/savedSearches";
import script from "@/tests/server/handlers/script";
import about from "./about";
import accessGroup from "./accessGroup";
import activity from "./activity";
import administrators from "./administrators";
import alerts from "./alerts";
import auth from "./auth";
import autoinstallFiles from "./autoinstallFiles";
import availabilityZones from "./availabilityZones";
import employees from "./employees";
import eventsLog from "./eventsLog";
import features from "./features";
import instance from "./instance";
import invitations from "./invitations";
import kernel from "./kernel";
import mirrors from "./mirrors";
import localRepository from "./localRepository";
import oidcIssuers from "./oidcIssuers";
import organisationPreferences from "./organisationPreferences";
import packageProfile from "./packageProfile";
import packages from "./packages";
import pockets from "./pockets";
import process from "./process";
import publications from "./publications";
import rebootProfiles from "./rebootProfiles";
import removalProfiles from "./removalProfiles";
import reports from "./reports";
import repository from "./repository";
import repositoryProfiles from "./repositoryProfiles";
import roles from "./roles";
import scriptProfiles from "./scriptProfiles";
import securityProfiles from "./securityProfiles";
import snap from "./snap";
import standaloneAccount from "./standaloneAccount";
import tag from "./tag";
import ubuntuPro from "./ubuntuPro";
import upgradeProfile from "./upgradeProfile";
import user from "./user";
import userSettings from "./userSettings";
import usn from "./usn";
import publicationTargets from "./publicationTargets";
import wsl from "./wsl";
import wslProfiles from "./wslProfiles";

export default [
  ...about,
  ...accessGroup,
  ...administrators,
  ...autoinstallFiles,
  ...activity,
  ...alerts,
  ...auth,
  ...oidcIssuers,
  ...availabilityZones,
  ...employees,
  ...eventsLog,
  ...instance,
  ...invitations,
  ...kernel,
  ...mirrors,
  ...localRepository,
  ...organisationPreferences,
  ...packageProfile,
  ...packages,
  ...pockets,
  ...process,
  ...publications,
  ...rebootProfiles,
  ...removalProfiles,
  ...reports,
  ...repository,
  ...repositoryProfiles,
  ...roles,
  ...savedSearches,
  ...securityProfiles,
  ...script,
  ...scriptProfiles,
  ...snap,
  ...standaloneAccount,
  ...tag,
  ...ubuntuPro,
  ...upgradeProfile,
  ...user,
  ...userSettings,
  ...usn,
  ...publicationTargets,
  ...wsl,
  ...wslProfiles,
  ...features,
];
