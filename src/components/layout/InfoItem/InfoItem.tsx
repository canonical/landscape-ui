import type { FC } from "react";
import type { RegularInfoItemProps } from "./RegularInfoItem";
import RegularInfoItem from "./RegularInfoItem";
import type { TruncatedInfoItemProps } from "./TruncatedInfoItem";
import TruncatedInfoItem from "./TruncatedInfoItem";

export type InfoItemProps =
  | ({ type?: "regular" } & RegularInfoItemProps)
  | ({ type: "password" } & Omit<RegularInfoItemProps, "value">)
  | ({ type: "truncated" } & TruncatedInfoItemProps);

const InfoItem: FC<InfoItemProps> = (props) => {
  switch (props.type) {
    case "password": {
      return <RegularInfoItem value="****************" {...props} />;
    }

    case "truncated": {
      return <TruncatedInfoItem {...props} />;
    }

    default: {
      return <RegularInfoItem {...props} />;
    }
  }
};

export default InfoItem;
