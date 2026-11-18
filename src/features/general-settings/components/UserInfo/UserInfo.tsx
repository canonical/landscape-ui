import type { FC } from "react";
import type { UserDetails } from "../../types";
import InfoItem from "@/components/layout/InfoItem";
import classes from "./UserInfo.module.scss";

interface UserInfoProps {
  readonly userDetails: UserDetails;
}

const UserInfo: FC<UserInfoProps> = ({ userDetails }) => {
  return (
    <InfoGrid dense>
      <InfoGrid.Item label="Name" value={userDetails.name} large />
      <InfoGrid.Item label="Email" value={userDetails.email} large />
    </InfoGrid>
  );
};

export default UserInfo;
