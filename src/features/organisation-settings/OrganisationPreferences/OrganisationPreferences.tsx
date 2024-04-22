import InfoItem from "@/components/layout/InfoItem";
import { Preferences } from "@/types/Preferences";
import { boolToLabel } from "@/utils/output";
import { Col, Row } from "@canonical/react-components";
import { FC } from "react";
import classes from "./OrganisationPreferences.module.scss";

interface OrganisationPreferencesProps {
  organisationPreferences: Preferences;
}

const OrganisationPreferences: FC<OrganisationPreferencesProps> = ({
  organisationPreferences,
}) => {
  const organisationDetails = [
    {
      label: "Organisation's name",
      value: organisationPreferences.title,
    },
    {
      label: "Registration key",
      value: organisationPreferences.registration_password ?? "-",
    },
    {
      label: "Auto register new computers",
      value: boolToLabel(organisationPreferences.auto_register_new_computers),
    },
  ];

  return (
    <div className={classes.infoRow}>
      <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
        {organisationDetails.map(({ label, value }) => (
          <Col size={4} key={label}>
            <InfoItem label={label} value={value} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default OrganisationPreferences;
