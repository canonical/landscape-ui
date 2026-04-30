import { useState, type FC } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import {
  Button,
  Form,
  Input,
  List,
  Notification,
} from "@canonical/react-components";
import { useFormik } from "formik";
import { useGetPageLocalRepository } from "../../api/useGetPageLocalRepository";
import * as Yup from "yup";
import { useImportRepositoryPackages } from "../../api/useImportRepositoryPackages";
import LoadingState from "@/components/layout/LoadingState";
import classes from "./ImportRepositoryPackagesSidePanel.module.scss";
import { pluralizeWithCount } from "@/utils/_helpers";
import type { TaskStatus } from "../../types/Task";

const ImportRepositoryPackagesSidePanel: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { popSidePath, name, createPageParamsSetter } = usePageParams();
  const { repository, isGettingRepository } = useGetPageLocalRepository();

  const { importRepositoryPackages, isImportingRepositoryPackages } =
    useImportRepositoryPackages();
  const closeSidePanel = createPageParamsSetter({
    sidePath: [],
    name: "",
  });

  const repositoryName = `locals/${name}`;
  const [validateTask, setValidateTask] = useState<
    | {
        status: TaskStatus;
        response: string[];
      }
    | undefined
  >(undefined);

  const handleSubmit = async (values: { source: string }) => {
    try {
      await importRepositoryPackages({
        name: repositoryName,
        url: values.source,
      });

      closeSidePanel();

      notify.success({
        title: `You have marked ${repository?.displayName} to import packages`,
        message:
          "An activity has been queued to import the packages to the local repository.",
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
  });

  if (isGettingRepository) {
    return <SidePanel.LoadingState />;
  }

  const handleValidate = async () => {
    try {
      setValidateTask(undefined);

      const { data } = await importRepositoryPackages({
        name: repositoryName,
        url: formik.values.source,
        validateOnly: true,
      });

      setValidateTask({
        status: data.metadata?.status as TaskStatus,
        response: data.response as unknown as string[],
      });
    } catch (error) {
      debug(error);
    }
  };

  const hasPackages =
    validateTask?.status === "succeeded" && !!validateTask.response.length;

  const packagesCount = hasPackages
    ? pluralizeWithCount(validateTask?.response.length, "package")
    : "packages";

  return (
    <>
      <SidePanel.Header>
        Import packages to {repository.displayName}
      </SidePanel.Header>
      <SidePanel.Content>
        <Form onSubmit={formik.handleSubmit} noValidate>
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
              {isImportingRepositoryPackages ||
              validateTask?.status === "in progress" ? (
                <LoadingState inline />
              ) : (
                "Fetch packages"
              )}
            </Button>
          </div>

          {validateTask?.status === "failed" && (
            <Notification
              severity="caution"
              title="Fetching packages timed out"
              borderless
            >
              <span>
                You can still proceed to import packages, although this process
                may fail if we can&apos;t fetch the packages from the source
                provided.
              </span>
            </Notification>
          )}

          {validateTask?.status === "succeeded" && (
            <>
              {!validateTask?.response.length ? (
                <Notification
                  severity="negative"
                  title="No packages available from the URL provided"
                  borderless
                />
              ) : (
                <List
                  items={validateTask.response.map((file) => (
                    <div className={classes.file} key={file}>
                      {file}
                    </div>
                  ))}
                  divided
                />
              )}
            </>
          )}

          <SidePanelFormButtons
            submitButtonDisabled={!hasPackages}
            submitButtonLoading={formik.isSubmitting}
            submitButtonText={`Import ${packagesCount}`}
            onCancel={popSidePath}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

export default ImportRepositoryPackagesSidePanel;
