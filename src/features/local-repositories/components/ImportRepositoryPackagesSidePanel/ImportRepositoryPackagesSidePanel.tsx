import { useState, type FC } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import { useGetPageLocalRepository } from "../../api/useGetPageLocalRepository";
import * as Yup from "yup";
import { useImportRepositoryPackages } from "../../api/useImportRepositoryPackages";
import { useGetOperation } from "@/features/operations";
import LoadingState from "@/components/layout/LoadingState";
import classes from "./ImportRepositoryPackagesSidePanel.module.scss";
import { pluralizeWithCount } from "@/utils/_helpers";
import type {
  OperationStatus,
  PackagesValidationState,
} from "@/features/operations";
import { getPackageList } from "./helpers";
import ValidationResult from "./ValidationResult/ValidationResult";

const POLL_INTERVAL = 2000;

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
  const [operationName, setOperationName] = useState<string>("");

  const isPolling = !!operationName;
  const { operation } = useGetOperation(operationName, {
    enabled: isPolling,
    refetchInterval: ({ state }) =>
      state.data?.data?.done ? false : POLL_INTERVAL,
  });

  const getTaskStatus = (): PackagesValidationState | undefined => {
    if (isPolling && operation) {
      const { response, count } = getPackageList(
        (operation.response?.output as string) ?? "",
      );

      return {
        done: operation.done ?? false,
        status: (operation.metadata?.status as OperationStatus) ?? "idle",
        response: response,
        count: count,
        error: operation.error,
      };
    }
    return undefined;
  };

  const validationTask = getTaskStatus();

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
      setOperationName("");

      const { data } = await importRepositoryPackages({
        name: repositoryName,
        url: formik.values.source,
        validateOnly: true,
      });

      setOperationName(data.name ?? "");
    } catch (error) {
      debug(error);
    }
  };

  const canImport =
    validationTask?.error?.code === 4 ||
    (validationTask?.status === "succeeded" && !!validationTask.count);

  const packagesCount =
    validationTask && validationTask.count > 0
      ? pluralizeWithCount(validationTask.count, "package")
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
              validationTask?.status === "idle" ||
              validationTask?.status === "in progress" ? (
                <LoadingState inline />
              ) : (
                "Fetch packages"
              )}
            </Button>
          </div>

          {validationTask?.done && (
            <ValidationResult validationTask={validationTask} />
          )}

          <SidePanelFormButtons
            submitButtonDisabled={!canImport}
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
