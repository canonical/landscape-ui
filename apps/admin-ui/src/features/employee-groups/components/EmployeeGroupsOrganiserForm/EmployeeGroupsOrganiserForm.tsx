import type { FC, FormEvent } from "react";
import { useState } from "react";
import type { EmployeeGroup } from "../../types";
import useSidePanel from "@/hooks/useSidePanel";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import EmployeeGroupSortableList from "../EmployeeGroupSortableList";
import { Form } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { useUpdateEmployeeGroups } from "../../api";
import { EDIT_PRIORITY_DESCRIPTION } from "../../constants";
import SidePanelDescription from "../SidePanelDescription";
import { pluralize } from "@/utils/_helpers";

interface EmployeeGroupsOrganiserFormProps {
  readonly groups: EmployeeGroup[];
}

const EmployeeGroupsOrganiserForm: FC<EmployeeGroupsOrganiserFormProps> = ({
  groups,
}) => {
  const [updatedGroups, setUpdatedGroups] = useState(groups);
  const [submissionBlocked, setSubmissionBlocked] = useState(false);

  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { notify } = useNotify();

  const { updateEmployeeGroups, isUpdatingEmployeeGroups } =
    useUpdateEmployeeGroups();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await updateEmployeeGroups(
        updatedGroups.map(({ id, priority, autoinstall_file }) => ({
          id,
          priority,
          autoinstall_file,
        })),
      );

      closeSidePanel();

      const title = `${pluralize(
        updatedGroups.length,
        "Priority",
        "Priorities",
      )} updated`;

      const message = pluralize(
        updatedGroups.length,
        `You've successfully updated priority for the ${updatedGroups[0]?.name ?? ""} group.`,
        `You've successfully updated priorities for ${updatedGroups.length} ${pluralize(updatedGroups.length, "group")}.`,
      );

      notify.success({
        title,
        message,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <>
      <SidePanelDescription>{EDIT_PRIORITY_DESCRIPTION}</SidePanelDescription>
      <Form onSubmit={handleSubmit}>
        <EmployeeGroupSortableList
          groups={updatedGroups}
          onPriorityChange={(id, priority) => {
            setUpdatedGroups(
              updatedGroups.map((group) =>
                group.id === id ? { ...group, priority } : group,
              ),
            );
          }}
          setSubmissionBlocked={setSubmissionBlocked}
        />
        <SidePanelFormButtons
          submitButtonText="Update priorities"
          submitButtonDisabled={isUpdatingEmployeeGroups || submissionBlocked}
        />
      </Form>
    </>
  );
};

export default EmployeeGroupsOrganiserForm;
