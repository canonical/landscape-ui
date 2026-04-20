import type { FC } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import Blocks from "@/components/layout/Blocks";
import { useGetPageLocalRepository } from "../../api/useGetPageLocalRepository";
import LocalRepositoryPackagesList from "../LocalRepositoryPackagesList";
import * as Yup from "yup";
import { useRemoveRepositoryPackages } from "../../api/useRemoveRepositoryPackages";
import { useUploadRepositoryPackages } from "../../api/useUploadRepositoryPackages";

const EditRepositoryPackagesSidePanel: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { sidePath, popSidePath, repository: repositoryId, createPageParamsSetter } = usePageParams();
  const { repository, isGettingRepository } = useGetPageLocalRepository();
  const { uploadRepositoryPackages, isUploadingRepositoryPackages } = useUploadRepositoryPackages();
  const { removeRepositoryPackages, isRemovingRepositoryPackages } = useRemoveRepositoryPackages();
  const closeSidePanel = createPageParamsSetter({ sidePath: [], repository: "" });

  const repositoryName = `locals/${repositoryId}`;

  const handleSubmit = async (values: { source: string; packages: string[] }) => {
    try {
      if (values.source) {
        await uploadRepositoryPackages({ name: repositoryName, source: values.source });
      }

      if (values.packages.length) {
        await removeRepositoryPackages({ name: repositoryName, packages: values.packages });
      }

      closeSidePanel();

      notify.success({
        title: "Packages updated",
        message: `The packages for local repository "${repository?.display_name ?? ""}" have been updated successfully`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: { source: "", packages: new Array<string>() },
    onSubmit: handleSubmit,
    validationSchema: Yup.object().shape({ source: Yup.string(), packages: Yup.array(Yup.string()) }),
    validateOnMount: true,
  });

  if (isGettingRepository) {
    return <SidePanel.LoadingState/>;
  }

  return (
    <>
      <SidePanel.Header>Edit packages for {repository.display_name}</SidePanel.Header>
      <SidePanel.Content>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Blocks>
            <Blocks.Item title="Repository Contents">
              <Input
                type="text"
                label="Source URL"
                {...formik.getFieldProps("source")}
                error={getFormikError(formik, "source")}
                help={"In order to upload packages, provide a URL for Landscape to fetch the packages from."}
              />
            </Blocks.Item>
          </Blocks>
          <LocalRepositoryPackagesList
            repository={repository}
            packagesToDelete={formik.values.packages}
            onPackageDelete={(name) => {
              formik.setFieldValue(
                "packages",
                formik.values.packages.includes(name)
                  ? formik.values.packages
                  : [...formik.values.packages, name],
              );
            }}
          />

          <SidePanelFormButtons
            submitButtonDisabled={!formik.isValid || !formik.values.packages.length && !formik.values.source}
            submitButtonLoading={formik.isSubmitting || isRemovingRepositoryPackages || isUploadingRepositoryPackages}
            submitButtonText="Save changes"
            hasBackButton={sidePath.length > 1}
            onBackButtonPress={popSidePath}
            onCancel={closeSidePanel}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

export default EditRepositoryPackagesSidePanel;
