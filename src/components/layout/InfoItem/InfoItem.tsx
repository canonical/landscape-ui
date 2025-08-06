import type { FC } from "react";
import type { RegularInfoItemProps } from "./RegularInfoItem";
import RegularInfoItem from "./RegularInfoItem";
import type { TruncatedInfoItemProps } from "./TruncatedInfoItem";
import TruncatedInfoItem from "./TruncatedInfoItem";

export type InfoItemProps =
  | ({ type?: "regular" } & RegularInfoItemProps)
  | ({ type: "password" } & Omit<RegularInfoItemProps, "value">)
  | ({ type: "truncated" } & TruncatedInfoItemProps);

const InfoItem: FC<InfoItemProps> = ({ type, ...props }) => {
  switch (type) {
    case "password": {
      return <RegularInfoItem {...props} value="****************" />;
    }

    case "truncated": {
      return <TruncatedInfoItem {...(props as TruncatedInfoItemProps)} />;
    }

    default: {
      return <RegularInfoItem {...(props as RegularInfoItemProps)} />;
    }
  }
};

export default InfoItem;
