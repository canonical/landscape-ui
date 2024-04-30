import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { UserDetails } from "@/types/UserDetails";
import { Button, Col, Row } from "@canonical/react-components";
import { FC, Suspense, lazy, useState } from "react";
import classes from "./GeneralSettings.module.scss";
import { useMediaQuery } from "usehooks-ts";

interface GeneralSettingsProps {
  user: UserDetails;
}

const EditUserForm = lazy(() => import("../edit-user-form"));
const ChangePasswordForm = lazy(() => import("../change-password-form"));

const GeneralSettings: FC<GeneralSettingsProps> = ({ user }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const { setSidePanelContent } = useSidePanel();
  const isLargeScreen = useMediaQuery("(min-width: 620px)");

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
      value: <code className={classes.identity}>{user.identity}</code>,
    },
    {
      label: "default organisation",
      value:
        user.accounts.find((acc) => acc.name === user.preferred_account)
          ?.title ?? "-",
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
        {isLargeScreen ? (
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
        ) : (
          <span className="p-contextual-menu">
            <Button
              className="p-contextual-menu__toggle u-no-margin--bottom"
              aria-controls="series-cta"
              aria-expanded={openDropdown}
              aria-haspopup="true"
              onClick={() => {
                setOpenDropdown((prevState) => !prevState);
              }}
              onBlur={() => {
                setOpenDropdown(false);
              }}
            >
              Actions
            </Button>
            <span
              className="p-contextual-menu__dropdown"
              id="series-cta"
              aria-hidden={!openDropdown}
            >
              <Button
                className="p-contextual-menu__link p-segmented-control__button u-no-margin--bottom"
                type="button"
                onClick={handleEditUser}
                onMouseDown={(e) => e.preventDefault()}
              >
                <span>Edit profile</span>
              </Button>
              <Button
                className="p-contextual-menu__link p-segmented-control__button u-no-margin--bottom"
                type="button"
                onClick={handleChangePassword}
                onMouseDown={(e) => e.preventDefault()}
              >
                <span>Change password</span>
              </Button>
            </span>
          </span>
        )}
      </div>
      <div className={classes.infoRow}>
        <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
          {userPersonalDetails.map(({ label, value }) => (
            <Col medium={3} size={3} key={label}>
              <InfoItem label={label} value={value} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default GeneralSettings;
