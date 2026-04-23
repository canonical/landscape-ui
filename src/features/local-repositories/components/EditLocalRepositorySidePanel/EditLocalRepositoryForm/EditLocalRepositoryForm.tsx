import type { FC } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import { type EditLocalRepositoryFormValues, VALIDATION_SCHEMA } from "./constants";
import Blocks from "@/components/layout/Blocks";
import { useUpdateLocalRepository } from "../../../api/useUpdateLocalRepository";
import type { LocalRepository } from "../../../types";
import ReadOnlyField from "@/components/form/ReadOnlyField";

interface EditLocalRepositoryFormProps {
  readonly repository: LocalRepository;
}

const EditLocalRepositoryForm: FC<EditLocalRepositoryFormProps> = ({
  repository,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { sidePath, popSidePath, createPageParamsSetter } = usePageParams();
  const { updateRepository, isUpdatingRepository } = useUpdateLocalRepository();

  const closeSidePanel = createPageParamsSetter({ sidePath: [], repository: "" });

  const handleSubmit = async (values: EditLocalRepositoryFormValues) => {
    const localToUpdate = {
      name: repository.name,
      display_name: values.displayName ?? repository.display_name,
      comment: values.description ?? repository.comment,
    };

    try {
      await updateRepository({ local: localToUpdate });

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
      name: repository.display_name,
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

          <ReadOnlyField
            label="Distribution"
            value={repository.distribution}
            tooltipMessage={`You can't change the distribution after the local repository is created`}
          />

          <ReadOnlyField
            label="Component"
            value={repository.component}
            tooltipMessage={`You can't change the component after the local repository is created`}
          />
        </Blocks.Item>
      </Blocks>

      <SidePanelFormButtons
        submitButtonLoading={formik.isSubmitting || isUpdatingRepository}
        submitButtonText="Save changes"
        hasBackButton={sidePath.length > 1}
        onBackButtonPress={popSidePath}
        onCancel={closeSidePanel}
      />
    </Form>
  );
};

export default EditLocalRepositoryForm;
