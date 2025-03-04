import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import type { EmployeeGroup } from "../../types";
import { useUpdateEmployeeGroups } from "@/features/employee-groups";
import useSidePanel from "@/hooks/useSidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import classes from "./EditEmployeeGroupPriorityForm.module.scss";
import { EDIT_PRIORITY_DESCRIPTION } from "../../constants";
import SidePanelDescription from "../SidePanelDescription";

interface EditEmployeeGroupPriorityFormProps {
  readonly group: EmployeeGroup;
}

const EditEmployeeGroupPriorityForm: FC<EditEmployeeGroupPriorityFormProps> = ({
  group,
}) => {
  const { updateEmployeeGroups, isUpdatingEmployeeGroups } =
    useUpdateEmployeeGroups();
  const { closeSidePanel } = useSidePanel();

  const debug = useDebug();
  const { notify } = useNotify();

  const formik = useFormik<Pick<EmployeeGroup, "priority">>({
    initialValues: {
      priority: group.priority,
    },
    validationSchema: Yup.object().shape({
      priority: Yup.number().positive().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await updateEmployeeGroups([
          {
            id: group.id,
            priority: values.priority,
            autoinstall_file: group.autoinstall_file,
          },
        ]);

        closeSidePanel();

        notify.success({
          title: "Priority updated",
          message: `You've successfully updated priority for the ${group.name} group.`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <SidePanelDescription>{EDIT_PRIORITY_DESCRIPTION}</SidePanelDescription>

      <Input
        type="number"
        label="Priority"
        autoComplete="off"
        wrapperClassName={classes.input}
        {...formik.getFieldProps("priority")}
      />

      <SidePanelFormButtons
        submitButtonDisabled={isUpdatingEmployeeGroups}
        submitButtonText="Update priority"
      />
    </Form>
  );
};

export default EditEmployeeGroupPriorityForm;
