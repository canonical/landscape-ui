import Menu from "@/components/layout/Menu";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { UbuntuProInfo } from "@/types/Instance";
import moment from "moment";
import type { FC } from "react";
import classes from "./UbuntuProHeader.module.scss";

interface UbuntuProHeaderProps {
  readonly ubuntuProData: UbuntuProInfo;
}

const UbuntuProHeader: FC<UbuntuProHeaderProps> = ({ ubuntuProData }) => {
  const infoItems = [
    {
      label: "Account",
      value: ubuntuProData.account?.name || null,
    },
    {
      label: "Subscription",
      value: ubuntuProData.contract?.name || null,
    },
    {
      label: "Valid Until",
      value:
        ubuntuProData.expires && moment(ubuntuProData.expires).isValid()
          ? moment(ubuntuProData.expires).format(DISPLAY_DATE_TIME_FORMAT)
          : null,
    },
    {
      label: "Technical Support Level",
      value: ubuntuProData.contract?.tech_support_level,
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
          <span className="u-text--muted">listed from </span>
          <a
            href="https://ubuntu.com/pro/dashboard"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Ubuntu Pro Dashboard
          </a>
        </span>
      </div>
      <Menu
        items={infoItems.map((item) => ({
          ...item,
          size: 3,
        }))}
      />
    </div>
  );
};

export default UbuntuProHeader;
