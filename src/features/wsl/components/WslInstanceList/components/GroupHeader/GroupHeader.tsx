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
  return (
    <>
      <CheckboxInput
        inline
        label={
          <span className="u-off-screen">{`Toggle "${label}" group`}</span>
        }
        labelClassName="u-no-margin--bottom u-no-padding--top"
        checked={
          !!wslInstances.length &&
          wslInstances.every((i) => selectedWslInstances.includes(i))
        }
        indeterminate={
          wslInstances.some((i) => selectedWslInstances.includes(i)) &&
          !wslInstances.every((i) => selectedWslInstances.includes(i))
        }
        disabled={!wslInstances.length}
        onChange={({ currentTarget: { checked } }) => {
          if (checked) {
            setSelectedWslInstances([
              ...selectedWslInstances.filter(
                (wslInstance) => !wslInstances.includes(wslInstance),
              ),
              ...wslInstances,
            ]);
          } else {
            setSelectedWslInstances(
              selectedWslInstances.filter(
                (wslInstance) => !wslInstances.includes(wslInstance),
              ),
            );
          }
        }}
      />

      <span className={classes.header}>
        {label} ({wslInstances.length})
      </span>
    </>
  );
};

export default GroupHeader;
