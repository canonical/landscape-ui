import type { FC } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import {
  type EditLocalRepositoryFormValues,
  VALIDATION_SCHEMA,
} from "./constants";
import Blocks from "@/components/layout/Blocks";
import { useUpdateLocalRepository } from "../../../api/useUpdateLocalRepository";
import type { Local } from "@canonical/landscape-openapi";
import ReadOnlyField from "@/components/form/ReadOnlyField";

interface EditLocalRepositoryFormProps {
  readonly repository: Local;
}

const EditLocalRepositoryForm: FC<EditLocalRepositoryFormProps> = ({
  repository,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { popSidePathUntilClear, closeSidePanel } = usePageParams();
  const { updateRepository, isUpdatingRepository } = useUpdateLocalRepository();

  const handleSubmit = async (values: EditLocalRepositoryFormValues) => {
    const localToUpdate = {
      name: repository.name ?? "",
      displayName: values.displayName ?? repository.displayName,
      comment: values.description ?? repository.comment,
      defaultDistribution: repository.defaultDistribution,
      defaultComponent: repository.defaultComponent,
    };

    try {
      await updateRepository(localToUpdate);

      closeSidePanel();

      notify.success({
        title: `You have successfully edited ${values.displayName}`,
        message: "The local repository details have been updated.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      displayName: repository.displayName,
      description: repository.comment,
    },
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
    validateOnMount: true,
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Blocks>
        <Blocks.Item title="Details">
          <Input
            type="text"
            label="Name"
            required
            {...formik.getFieldProps("displayName")}
            error={getFormikError(formik, "displayName")}
          />

          <Input
            type="text"
            label="Description"
            autoComplete="off"
            {...formik.getFieldProps("description")}
            error={getFormikError(formik, "description")}
          />

          <ReadOnlyField
            label="Distribution"
            value={repository.defaultDistribution}
            tooltipMessage={`You can't change the distribution after the local repository is created`}
          />

          <ReadOnlyField
            label="Component"
            value={repository.defaultComponent}
            tooltipMessage={`You can't change the component after the local repository is created`}
          />
        </Blocks.Item>
      </Blocks>

      <SidePanelFormButtons
        submitButtonLoading={formik.isSubmitting || isUpdatingRepository}
        submitButtonText="Save changes"
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default EditLocalRepositoryForm;
