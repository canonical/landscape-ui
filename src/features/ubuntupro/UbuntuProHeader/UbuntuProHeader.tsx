import { FC } from "react";
import classes from "./UbuntuProHeader.module.scss";
import classNames from "classnames";
import { Col, Link, Row } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import { UbuntuProInfo } from "@/types/Instance";

interface UbuntuProHeaderProps {
  data: UbuntuProInfo;
}

const UbuntuProHeader: FC<UbuntuProHeaderProps> = ({ data }) => {
  const infoItems = [
    {
      label: "Account",
      value: data.account.name,
    },
    {
      label: "Subscription",
      value: data.contract.name,
    },
    {
      label: "Valid Until",
      value: new Date(data.expires).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
        timeZone: "UTC",
      }),
    },
    {
      label: "Technical Support Level",
      value: data.contract.tech_support_level,
    },
  ];
  return (
    <div className={classes.infoRow}>
      <div className={classes.header}>
        <span className="p-heading--5">Account information</span>{" "}
        <span
          style={{
            display: "inline",
          }}
        >
          <i className={classNames("p-icon--information", classes.helpIcon)} />
          <span className="u-text--muted">listed from </span>
          <Link
            href="https://ubuntu.com/pro/dashboard"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Ubuntu Pro Dashboard
            <i className="p-icon--external-link" />
          </Link>
        </span>
      </div>
      <Row className="u-no-padding--left u-no-padding--right u-no-max-width">
        {infoItems.map(({ label, value }) => (
          <Col size={3} key={label}>
            <InfoItem label={label} value={value} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UbuntuProHeader;
