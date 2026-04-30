import type { FC } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import {
  type AddLocalRepositoryFormValues,
  INITIAL_VALUES,
  VALIDATION_SCHEMA,
} from "./constants";
import { useCreateLocalRepository } from "../../api/useCreateLocalRepository";
import Blocks from "@/components/layout/Blocks";

const AddLocalRepositorySidePanel: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { createPageParamsSetter } = usePageParams();
  const { createRepository, isCreatingRepository } = useCreateLocalRepository();

  const closeSidePanel = createPageParamsSetter({
    sidePath: [],
    name: "",
  });

  const handleSubmit = async (values: AddLocalRepositoryFormValues) => {
    const valuesforCreation = {
      displayName: values.name,
      comment: values.description,
      defaultDistribution: values.distribution,
      defaultComponent: values.component,
    };

    try {
      await createRepository(valuesforCreation);

      closeSidePanel();

      notify.success({
        title: `You have successfully added ${values.name}`,
        message:
          "The local repository has been created and is now available to import packages.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
    validateOnMount: true,
  });

  return (
    <>
      <SidePanel.Header>Add local repository</SidePanel.Header>
      <SidePanel.Content>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Blocks>
            <Blocks.Item title="Details" titleClassName="p-text--small-caps">
              <Input
                type="text"
                label="Name"
                required
                {...formik.getFieldProps("name")}
                error={getFormikError(formik, "name")}
              />

              <Input
                type="text"
                label="Description"
                autoComplete="off"
                {...formik.getFieldProps("description")}
                error={getFormikError(formik, "description")}
              />

              <Input
                type="text"
                label="Distribution"
                required
                {...formik.getFieldProps("distribution")}
                error={getFormikError(formik, "distribution")}
              />

              <Input
                type="text"
                label="Component"
                required
                {...formik.getFieldProps("component")}
                error={getFormikError(formik, "component")}
              />
            </Blocks.Item>
          </Blocks>

          <SidePanelFormButtons
            submitButtonLoading={formik.isSubmitting || isCreatingRepository}
            submitButtonText="Add repository"
            onCancel={closeSidePanel}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

export default AddLocalRepositorySidePanel;
