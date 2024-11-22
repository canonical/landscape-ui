import { FC } from "react";
import { Instance } from "@/types/Instance";
import useRoles from "@/hooks/useRoles";
import { useFormik } from "formik";
import { Form, Select } from "@canonical/react-components";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { AccessGroupChangeFormValues } from "./types";
import useDebug from "@/hooks/useDebug";
import { getAccessGroupOptions } from "./helpers";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";

interface AccessGroupChangeProps {
  selected: Instance[];
}

const AccessGroupChange: FC<AccessGroupChangeProps> = ({ selected }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { getAccessGroupQuery, changeComputersAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const { mutateAsync: changeComputersAccessGroup } =
    changeComputersAccessGroupQuery;

  const accessGroupOptions = getAccessGroupOptions(
    getAccessGroupQueryResult?.data,
  );

  const handleSubmit = async ({
    access_group,
  }: AccessGroupChangeFormValues) => {
    try {
      await changeComputersAccessGroup({
        access_group,
        query: selected.map(({ id }) => `id:${id}`).join(" OR "),
      });

      closeSidePanel();

      notify.success({
        title: "Access group changed",
        message: `Access group for ${selected.length > 1 ? `${selected.length} instances` : `"${selected[0].title}" instance`} successfully changed to ${accessGroupOptions.find(({ value }) => value === access_group)?.label ?? ""}`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Select
        label="Access group"
        required
        options={getAccessGroupOptions(getAccessGroupQueryResult?.data)}
        {...formik.getFieldProps("access_group")}
        error={
          formik.touched.access_group && formik.errors.access_group
            ? formik.errors.access_group
            : undefined
        }
      />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Assign"
      />
    </Form>
  );
};

export default AccessGroupChange;
