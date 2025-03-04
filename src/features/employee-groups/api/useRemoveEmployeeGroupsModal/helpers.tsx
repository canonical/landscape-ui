import type { ReactNode } from "react";
import type { EmployeeGroup } from "../../types";

export const getRemoveEmployeeGroupsModalTexts = (
  employeeGroupsSelected: EmployeeGroup[],
): {
  title: string;
  body: ReactNode;
  notificationTitle: string;
  notificationText: string;
} => {
  if (employeeGroupsSelected.length === 1) {
    return {
      title: `Remove ${employeeGroupsSelected[0].name} employee group`,
      body: (
        <p>
          You are about to remove {employeeGroupsSelected[0].name} from
          Landscape. This action is irreversible and will permanently remove the
          group from Landscape. However, it will <b>NOT</b> remove the users
          associated with this group.
        </p>
      ),
      notificationTitle: `You have successfully removed ${employeeGroupsSelected[0].name} employee group`,
      notificationText: `${employeeGroupsSelected[0].name} employee group has been permanently removed from Landscape`,
    };
  }

  return {
    title: "Remove employee groups",
    body: (
      <p>
        You are about to remove {employeeGroupsSelected.length} employee groups
        from Landscape. This action is irreversible and will permanently remove
        the groups from Landscape. However, it will <b>NOT</b> remove the users
        associated with these groups.
      </p>
    ),
    notificationTitle: `You have successfully removed ${employeeGroupsSelected.length} employee groups`,
    notificationText: `${employeeGroupsSelected.length} employee groups have been permanently removed from Landscape.`,
  };
};
