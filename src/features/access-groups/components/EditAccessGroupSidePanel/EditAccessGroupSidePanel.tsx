import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { getFormikError } from "@/utils/formikErrors";
import * as Yup from "yup";
import { useEditAccessGroup, useGetAccessGroup } from "../../api";
import usePageParams from "@/hooks/usePageParams";
import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import useNotify from "@/hooks/useNotify";

const EditAccessGroupSidePanel: FC = () => {
  const { editAccessGroup, isEditingAccessGroup } = useEditAccessGroup();
  const { popSidePathUntilClear, closeSidePanel, name } = usePageParams();
  const { accessGroup, isGettingAccessGroup, accessGroupError } =
    useGetAccessGroup(name);
  const { accessGroup: parent } = useGetAccessGroup(accessGroup?.parent ?? "");

  const VALIDATION_SCHEMA = Yup.object().shape({
    title: Yup.string().required("This field is required"),
  });

  const { notify } = useNotify();
  const debug = useDebug();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { title: accessGroup?.title ?? "" },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        await editAccessGroup({ name, title: values.title });
        closeSidePanel();
        notify.success({
          title: `You have successfully edited ${values.title}`,
          message: `The access group has been updated.`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  if (isGettingAccessGroup) {
    return <LoadingState />;
  }

  if (accessGroupError || !accessGroup) {
    throw new Error(accessGroupError?.message ?? "Access group not found");
  }

  return (
    <>
      <SidePanel.Header>Edit {accessGroup.title}</SidePanel.Header>
      <SidePanel.Content>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Input
            type="text"
            label="Title"
            required
            error={getFormikError(formik, "title")}
            {...formik.getFieldProps("title")}
          />
          <ReadOnlyField
            label="Parent"
            value={parent?.title ?? accessGroup.parent}
          />
          <SidePanelFormButtons
            onCancel={popSidePathUntilClear}
            submitButtonLoading={formik.isSubmitting || isEditingAccessGroup}
            submitButtonText="Save changes"
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

export default EditAccessGroupSidePanel;
