import type { FC } from "react";
import type { UserDetails } from "../../types";
import InfoGrid from "@/components/layout/InfoGrid";

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
