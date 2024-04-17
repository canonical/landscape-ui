import auth from "./auth";
import instance from "./instance";
import usn from "./usn";
import snap from "./snap";
import gpgKey from "./gpgKey";
import repo from "./repo";
import accessGroup from "./accessGroup";
import tag from "./tag";

export default [
  ...auth,
  ...instance,
  ...usn,
  ...snap,
  ...gpgKey,
  ...repo,
  ...accessGroup,
  ...tag,
];
