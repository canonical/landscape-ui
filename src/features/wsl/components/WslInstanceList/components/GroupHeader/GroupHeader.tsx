import type { InstanceChild } from "@/types/Instance";
import { CheckboxInput } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./GroupHeader.module.scss";

interface GroupHeaderProps {
  readonly label: string;
  readonly wslInstances: InstanceChild[];
  readonly selectedWslInstances: InstanceChild[];
  readonly setSelectedWslInstances: (wslInstances: InstanceChild[]) => void;
}

const GroupHeader: FC<GroupHeaderProps> = ({
  label,
  selectedWslInstances,
  setSelectedWslInstances,
  wslInstances,
}) => {
  const nonPendingWslInstances = wslInstances.filter(
    (wslInstance) => wslInstance.compliance !== "pending",
  );

  return (
    <div className={classes.groupHeader}>
      <CheckboxInput
        inline
        label={
          <span className="u-off-screen">{`Toggle "${label}" group`}</span>
        }
        labelClassName="u-no-margin--bottom u-no-padding--top"
        checked={
          !!nonPendingWslInstances.length &&
          nonPendingWslInstances.every((i) => selectedWslInstances.includes(i))
        }
        indeterminate={
          nonPendingWslInstances.some((i) =>
            selectedWslInstances.includes(i),
          ) &&
          !nonPendingWslInstances.every((i) => selectedWslInstances.includes(i))
        }
        disabled={!nonPendingWslInstances.length}
        onChange={({ currentTarget: { checked } }) => {
          if (checked) {
            setSelectedWslInstances([
              ...selectedWslInstances.filter(
                (wslInstance) => !nonPendingWslInstances.includes(wslInstance),
              ),
              ...nonPendingWslInstances,
            ]);
          } else {
            setSelectedWslInstances(
              selectedWslInstances.filter(
                (wslInstance) => !nonPendingWslInstances.includes(wslInstance),
              ),
            );
          }
        }}
      />

      <span className={classes.label}>
        {label} ({wslInstances.length})
      </span>
    </div>
  );
};

export default GroupHeader;
