import { useState, type FC } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Form, Input, Notification } from "@canonical/react-components";
import { useFormik } from "formik";
import Blocks from "@/components/layout/Blocks";
import { useGetPageLocalRepository } from "../../api/useGetPageLocalRepository";
import * as Yup from "yup";
import { useImportRepositoryPackages } from "../../api/useImportRepositoryPackages";
import LoadingState from "@/components/layout/LoadingState";
import type { Task } from "../../types";
import classes from "./ImportRepositoryPackagesSidePanel.module.scss";
import File from "@/components/ui/File";

const ImportRepositoryPackagesSidePanel: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const {
    sidePath,
    popSidePath,
    repository: repositoryId,
    createPageParamsSetter,
  } = usePageParams();
  const { repository, isGettingRepository } = useGetPageLocalRepository();
  
  const { importRepositoryPackages, isImportingRepositoryPackages } =
    useImportRepositoryPackages();
  const closeSidePanel = createPageParamsSetter({
    sidePath: [],
    repository: "",
  });

  const repositoryName = `locals/${repositoryId}`;
  const [validateTask, setValidateTask] = useState<Task | undefined>(undefined);

  const handleSubmit = async (values: { source: string }) => {
    try {
      await importRepositoryPackages({
        name: repositoryName,
        url: values.source,
      });

      closeSidePanel();

      notify.success({
        title: `You have marked ${repository?.display_name} to import packages`,
        message: "An activity has been queued to import the packages to the local repository.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: { source: "" },
    onSubmit: handleSubmit,
    validationSchema: Yup.object().shape({
      source: Yup.string().required("This field is required."),
    }),
    validateOnMount: true,
  });

  if (isGettingRepository) {
    return <SidePanel.LoadingState />;
  }

  const handleValidate = async () => {
    try {
      const task = await importRepositoryPackages({
        name: repositoryName,
        url: formik.values.source,
        validate_only: true,
      });

      setValidateTask(task.data);

    } catch (error) {
      debug(error);
    }
  };

  return (
    <>
      <SidePanel.Header>
        Import packages to {repository.display_name}
      </SidePanel.Header>
      <SidePanel.Content>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Blocks>
            <Blocks.Item title="Repository Contents">
              <div className={classes.row}>
                <Input
                  type="text"
                  label="Source URL"
                  {...formik.getFieldProps("source")}
                  error={getFormikError(formik, "source")}
                  help={
                    "In order to upload packages, provide a URL for Landscape to fetch the packages from."
                  }
                />

                <Button
                  disabled={!formik.values.source}
                  onClick={handleValidate}
                  type="button"
                  className={classes.button}
                >
                  {isImportingRepositoryPackages
                    ? <LoadingState inline />
                    : "Fetch packages"
                  }
                </Button>
              </div>

              {validateTask?.status === "failed" &&
                <Notification
                  severity="caution"
                  title="Fetching packages timed out"
                  borderless
                >
                  <span>
                    You can still proceed to import packages, although this process may fail if we can&apos;t fetch the packages from the source provided. 
                  </span>
                </Notification>
              }
              {validateTask?.status === "done" && validateTask.output &&
                validateTask.output.split(", ").map((packageName) => 
                  <File
                    name={packageName}
                    onDismiss={() => {
                      setValidateTask({
                        ...validateTask,
                        output: validateTask.output
                          .split(", ")
                          .filter((name) => name !== packageName)
                          .join(", ")
                      });
                    }}
                    key={packageName}
                  />
                )
              }
            </Blocks.Item>
          </Blocks>

          <SidePanelFormButtons
            submitButtonDisabled={!formik.isValid}
            submitButtonLoading={
              formik.isSubmitting ||
              isImportingRepositoryPackages
            }
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

export default ImportRepositoryPackagesSidePanel;
