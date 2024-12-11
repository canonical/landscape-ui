import moment from "moment/moment";
import { InfoItemProps } from "@/components/layout/InfoItem";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { Instance } from "@/types/Instance";
import { SelectOption } from "@/types/SelectOption";

const getIpAddress = (instance: Instance) => {
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
  instance: Instance,
  accessGroupOptions: SelectOption[],
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
      label: "Access group",
      value:
        accessGroupOptions.find(({ value }) => value === instance.access_group)
          ?.label || instance.access_group,
    },
    {
      label: "Last ping time",
      value:
        instance.last_ping_time && moment(instance.last_ping_time).isValid() ? (
          moment(instance.last_ping_time).format(DISPLAY_DATE_TIME_FORMAT)
        ) : (
          <NoData />
        ),
    },
    {
      label: "Annotations",
      value: instance.annotations ? (
        Object.entries(instance.annotations).map(
          ([key, value], index, array) => (
            <>
              <span>{`${key}: ${value}`}</span>
              {index < array.length - 1 && <br />}
            </>
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
