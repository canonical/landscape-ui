import { FC } from "react";
import { CheckboxInput } from "@canonical/react-components";
import { AccessGroupOption } from "@/pages/dashboard/settings/roles/types";
import classes from "./AccessGroupBlock.module.scss";

interface AccessGroupBlockProps {
  accessGroupOptions: AccessGroupOption[];
  accessGroups: string[];
  onAccessGroupChange: (newAccessGroups: string[]) => void;
}

const AccessGroupBlock: FC<AccessGroupBlockProps> = ({
  accessGroupOptions,
  accessGroups,
  onAccessGroupChange,
}) => {
  const handleAccessGroupChange = (
    option: AccessGroupOption,
    options: AccessGroupOption[],
  ) => {
    if (
      accessGroups.includes(option.value) ||
      accessGroups.some((accessGroup) => option.children.includes(accessGroup))
    ) {
      onAccessGroupChange(
        accessGroups.filter(
          (accessGroup) =>
            ![option.value, ...option.children, option.parents].includes(
              accessGroup,
            ),
        ),
      );
    } else {
      const newAccessGroups = [
        ...accessGroups,
        option.value,
        ...option.children,
      ];

      for (let i = option.depth - 1; i >= 0; i--) {
        const currentDepthParent = options
          .filter(({ depth }) => depth === i)
          .find(({ value }) => option.parents.includes(value));

        if (
          currentDepthParent &&
          currentDepthParent.children.every((child) =>
            newAccessGroups.includes(child),
          )
        ) {
          newAccessGroups.push(currentDepthParent.value);
        } else {
          break;
        }
      }

      onAccessGroupChange(newAccessGroups);
    }
  };

  const isIndeterminate = (children: string[]) => {
    return (
      children.some((child) => accessGroups.includes(child)) &&
      children.some((child) => !accessGroups.includes(child))
    );
  };

  return (
    <>
      <p className="p-heading--5 u-no-margin--bottom">Access Groups</p>

      {accessGroupOptions.map((option, _, array) => (
        <CheckboxInput
          key={option.value}
          label={option.label}
          labelClassName={classes[`depth-${option.depth}`]}
          name="access_groups"
          checked={accessGroups.includes(option.value)}
          indeterminate={isIndeterminate(option.children)}
          onChange={() => handleAccessGroupChange(option, array)}
        />
      ))}
    </>
  );
};

export default AccessGroupBlock;
