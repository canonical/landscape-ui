import moment from "moment/moment";
import { InfoItemProps } from "@/components/layout/InfoItem";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { InstanceWithoutRelation } from "@/types/Instance";
import { SelectOption } from "@/types/SelectOption";

export const getInstanceInfoItems = (
  instance: InstanceWithoutRelation,
  accessGroupOptions: SelectOption[],
): InfoItemProps[] => {
  return [
    {
      label: "Last ping time",
      value:
        instance.last_ping_time && moment(instance.last_ping_time).isValid()
          ? moment(instance.last_ping_time).format(DISPLAY_DATE_TIME_FORMAT)
          : "---",
    },
    {
      label: "Hostname",
      value: instance.hostname,
    },
    {
      label: "instance ID",
      value: instance.id,
    },
    {
      label: "Serial number",
      value: instance.grouped_hardware?.system.serial ?? "---",
    },
    {
      label: "Product identifier",
      value: instance.grouped_hardware?.system.model ?? "---",
    },
    {
      label: "Distribution",
      value: instance.distribution ?? "---",
    },
    {
      label: "Access group",
      value:
        accessGroupOptions.find(({ value }) => value === instance.access_group)
          ?.label || instance.access_group,
    },
    {
      label: "Tags",
      value: instance.tags?.join(", ") || "---",
    },
    {
      label: "Annotations",
      value: instance.annotations
        ? Object.entries(instance.annotations).map(
            ([key, value], index, array) => (
              <>
                <span>{`${key}: ${value}`}</span>
                {index < array.length - 1 && <br />}
              </>
            ),
          )
        : "---",
    },
    {
      label: "Comment",
      value: instance.comment || "---",
    },
  ];
};
