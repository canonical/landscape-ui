import type { FC } from "react";
import { IMPORT_GROUPS_LIMIT } from "../../constants";
import { Notification } from "@canonical/react-components";
import { useGetEmployeeGroups } from "@/features/employee-groups";

const MaybeExceededLimitNotification: FC = () => {
  const { employeeGroupsCount } = useGetEmployeeGroups();

  if (employeeGroupsCount && employeeGroupsCount <= IMPORT_GROUPS_LIMIT) {
    return null;
  }

  return (
    <div>
      <Notification severity="negative" title="Group limit reached">
        {`You've reached the limit of ${IMPORT_GROUPS_LIMIT.toLocaleString()} groups. Remove excess groups to proceed.`}
      </Notification>
    </div>
  );
};

export default MaybeExceededLimitNotification;
