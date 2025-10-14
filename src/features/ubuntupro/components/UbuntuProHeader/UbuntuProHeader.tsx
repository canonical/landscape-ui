import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { UbuntuProInfo } from "@/types/Instance";
import moment from "moment";
import type { FC } from "react";
import classes from "./UbuntuProHeader.module.scss";

interface UbuntuProHeaderProps {
  readonly ubuntuProData: UbuntuProInfo;
}

const UbuntuProHeader: FC<UbuntuProHeaderProps> = ({ ubuntuProData }) => (
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
    <InfoGrid spaced>
      <InfoGrid.Item label="Account" value={ubuntuProData.account?.name} />

      <InfoGrid.Item
        label="Subscription"
        value={ubuntuProData.contract?.name}
      />

      <InfoGrid.Item
        label="Valid Until"
        value={
          ubuntuProData.expires && moment(ubuntuProData.expires).isValid()
            ? moment(ubuntuProData.expires).format(DISPLAY_DATE_TIME_FORMAT)
            : null
        }
      />

      <InfoGrid.Item
        label="Technical Support Level"
        value={ubuntuProData.contract?.tech_support_level}
      />
    </InfoGrid>
  </div>
);

export default UbuntuProHeader;
