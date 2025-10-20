import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { Instance, UbuntuProInfo } from "@/types/Instance";
import moment from "moment";
import { type FC } from "react";
import classes from "./UbuntuProInfoRow.module.scss";

interface UbuntuProInfoRowProps {
  readonly instance: Instance;
}

const UbuntuProInfoRow: FC<UbuntuProInfoRowProps> = ({ instance }) => {
  const ubuntuProData = instance.ubuntu_pro_info as UbuntuProInfo;

  return (
    <div className={classes.infoRow}>
      <InfoGrid spaced>
        <InfoGrid.Item label="Account" value={ubuntuProData.account?.name} />

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

        <InfoGrid.Item label="Token" type="password" />
      </InfoGrid>
    </div>
  );
};

export default UbuntuProInfoRow;
