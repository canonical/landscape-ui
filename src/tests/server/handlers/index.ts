import auth from "./auth";
import instance from "./instance";
import usn from "./usn";
import user from "./user";
import snap from "./snap";
import gpgKey from "./gpgKey";
import repo from "./repo";
import accessGroup from "./accessGroup";
import tag from "./tag";
import upgradeProfile from "./upgradeProfile";
import activity from "./activity";
import packages from "./packages";
import process from "./process";

export default [
  ...auth,
  ...instance,
  ...usn,
  ...snap,
  ...user,
  ...activity,
  ...process,
  ...packages,
  ...gpgKey,
  ...repo,
  ...accessGroup,
  ...tag,
  ...upgradeProfile,
];
