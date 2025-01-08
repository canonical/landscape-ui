import { FC } from "react";
import { UserDetails } from "../../types";
import InfoItem from "@/components/layout/InfoItem";
import { Col, Row } from "@canonical/react-components";

interface UserInfoProps {
  userDetails: UserDetails;
}

const UserInfo: FC<UserInfoProps> = ({ userDetails }) => {
  return (
    <Row className="u-no-padding--left u-no-padding--right">
      <Col
        size={6}
        emptyLarge={4}
        medium={2}
        emptyMedium={3}
        small={2}
        emptySmall={2}
      >
        <InfoItem label="Name" value={userDetails.name} />
      </Col>
      <Col
        size={6}
        emptyLarge={4}
        medium={2}
        emptyMedium={3}
        small={2}
        emptySmall={2}
      >
        <InfoItem label="Email" value={userDetails.email} />
      </Col>
    </Row>
  );
};

export default UserInfo;
