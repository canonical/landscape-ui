import { Fragment } from "react";
import moment from "moment/moment";
import type { InfoItemProps } from "@landscape/ui";
import { NoData } from "@landscape/ui";
import type { InstanceWithoutRelation } from "@landscape/types";

const getIpAddress = (instance: InstanceWithoutRelation) => {
  const network = instance.grouped_hardware?.network;

  if (!Array.isArray(network) || network.length === 0) {
    return <NoData />;
  }

  return (
    network
      .filter(({ ip }) => ip !== "Not available")
      .map(({ ip }) => ip)
      .join(", ") || <NoData />
  );
};

export const getInstanceInfoItems = (
  instance: InstanceWithoutRelation,
): InfoItemProps[] => {
  return [
    {
      label: "instance ID",
      value: instance.id,
    },
    {
      label: "Hostname",
      value: instance.hostname,
    },
    {
      label: "IP Address",
      value: getIpAddress(instance),
    },
    {
      label: "Serial number",
      value: instance.grouped_hardware?.system.serial ?? <NoData />,
    },
    {
      label: "Product identifier",
      value: instance.grouped_hardware?.system.model ?? <NoData />,
    },
    {
      label: "Distribution",
      value: instance.distribution ?? "Unknown",
    },
    {
      label: "Last ping time",
      value:
        instance.last_ping_time && moment(instance.last_ping_time).isValid() ? (
          moment(instance.last_ping_time).format("MMM DD, YYYY, HH:mm") // TODO CHANGE
        ) : (
          <NoData />
        ),
    },
    {
      label: "Annotations",
      value: instance.annotations ? (
        Object.entries(instance.annotations).map(
          ([key, value], index, array) => (
            <Fragment key={key}>
              <span>{`${key}: ${value}`}</span>
              {index < array.length - 1 && <br />}
            </Fragment>
          ),
        )
      ) : (
        <NoData />
      ),
    },
    {
      label: "Comment",
      value: instance.comment || <NoData />,
    },
  ];
};
