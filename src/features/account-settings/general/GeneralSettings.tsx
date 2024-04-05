import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { UserDetails } from "@/types/UserDetails";
import { Button, Col, Row } from "@canonical/react-components";
import { FC, Suspense, lazy } from "react";
import classes from "./GeneralSettings.module.scss";

interface GeneralSettingsProps {
  user: UserDetails;
}

const EditUserForm = lazy(() => import("../edit-user-form"));
const ChangePasswordForm = lazy(() => import("../change-password-form"));

const GeneralSettings: FC<GeneralSettingsProps> = ({ user }) => {
  const { setSidePanelContent } = useSidePanel();

  const userPersonalDetails = [
    {
      label: "email",
      value: user.email,
    },
    {
      label: "timezone",
      value: user.timezone,
    },
    {
      label: "identity",
      value: <code>{user.identity}</code>,
    },
  ];

  const handleEditUser = () => {
    setSidePanelContent(
      "Edit details",
      <Suspense fallback={<LoadingState />}>
        <EditUserForm user={user as UserDetails} />
      </Suspense>,
    );
  };

  const handleChangePassword = () => {
    setSidePanelContent(
      "Change password",
      <Suspense fallback={<LoadingState />}>
        <ChangePasswordForm />
      </Suspense>,
    );
  };

  return (
    <>
      <div className={classes.titleRow}>
        <h2 className="p-heading--4 u-no-margin--bottom u-no-padding--top">
          {user.name}
        </h2>
        <div>
          <Button
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            onClick={handleEditUser}
          >
            <span>Edit profile</span>
          </Button>
          <Button
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            onClick={handleChangePassword}
          >
            <span>Change password</span>
          </Button>
        </div>
      </div>
      <div className={classes.infoRow}>
        <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
          {userPersonalDetails.map(({ label, value }) => (
            <Col size={label === "identity" ? 6 : 3} key={label}>
              <InfoItem label={label} value={value} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default GeneralSettings;
