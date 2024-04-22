import auth from "./auth";
import instance from "./instance";
import usn from "./usn";
import snap from "./snap";
import gpgKey from "./gpgKey";
import repo from "./repo";

export default [...auth, ...instance, ...usn, ...snap, ...gpgKey, ...repo];
