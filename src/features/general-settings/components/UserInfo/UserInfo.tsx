import type { FC } from "react";
import type { UserDetails } from "../../types";
import InfoItem from "@/components/layout/InfoItem";
import classes from "./UserInfo.module.scss";

interface UserInfoProps {
  readonly userDetails: UserDetails;
}

const UserInfo: FC<UserInfoProps> = ({ userDetails }) => {
  return (
    <div className={classes.list}>
      <InfoItem label="Name" value={userDetails.name} />
      <InfoItem label="Email" value={userDetails.email} />
    </div>
  );
};

export default UserInfo;
