import CodeEditor from "@/components/form/CodeEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import type { AutoinstallFile } from "@/features/autoinstall-files";
import {
  useAddAutoinstallFile,
  useGetAutoinstallFiles,
} from "@/features/autoinstall-files";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  Button,
  CodeSnippet,
  Form,
  Icon,
  Input,
  Select,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import { useRef, type FC } from "react";
import { useUpdateEmployeeGroups } from "../../api";
import type { EmployeeGroup } from "../../types";
import AutoInstallFileFormDropdown from "../AutoInstallFileFormDropdown";
import classes from "./AssignAutoInstallFileForm.module.scss";
import {
  AUTOINSTALL_FILES,
  INITIAL_VALUES,
  VALIDATION_SCHEMA,
} from "./constants";
import type { FormProps } from "./types";
import { pluralize } from "@/utils/_helpers";

interface AssignAutoInstallFileFormProps {
  readonly employeeGroups: EmployeeGroup[];
  readonly clearSelectedGroups?: () => void;
}

const AssignAutoInstallFileForm: FC<AssignAutoInstallFileFormProps> = ({
  employeeGroups,
  clearSelectedGroups: setClearSelectedGroups,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const { updateEmployeeGroups, isUpdatingEmployeeGroups } =
    useUpdateEmployeeGroups();

  const { addAutoinstallFile, isAutoinstallFileAdding } =
    useAddAutoinstallFile();

  const affectedEmployeesAmount = employeeGroups.reduce(
    (acc, { employee_count = 0 }) => acc + (employee_count ?? 0),
    0,
  );

  const notifySuccess = (filename: string) => {
    notify.success({
      title: `Successfully reassigned ${filename} to ${pluralize(
        employeeGroups.length,
        `${employeeGroups[0]?.name ?? "1"} group`,
        `${employeeGroups.length} groups`,
      )}.`,
      message: `Autoinstall file assigned to ${affectedEmployeesAmount} employees${pluralize(
        employeeGroups.length,
        ` in ${employeeGroups[0]?.name ?? "1"} group`,
        ` across ${employeeGroups.length} groups`,
      )}.`,
    });
  };

  const handleCreateAndAssignAutoinstallFile = async (
    contents: string,
    filename: string,
  ) => {
    try {
      const { data: newAutoinstallFile } = await addAutoinstallFile({
        contents,
        filename,
      });

      await updateEmployeeGroups(
        employeeGroups.map((group) => ({
          autoinstall_file: newAutoinstallFile,
          id: group.id,
          priority: group.priority,
        })),
      );

      closeSidePanel();

      notifySuccess(filename);

      if (setClearSelectedGroups) {
        setClearSelectedGroups();
      }
    } catch (error) {
      debug(error);
    }
  };

  const handleAssignExistingAutoinstallFile = async (
    autoinstallFile: AutoinstallFile,
  ) => {
    try {
      await updateEmployeeGroups(
        employeeGroups.map((group) => ({
          autoinstall_file: autoinstallFile,
          id: group.id,
          priority: group.priority,
        })),
      );

      closeSidePanel();

      notifySuccess(autoinstallFile.filename);

      if (setClearSelectedGroups) {
        setClearSelectedGroups();
      }
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      if (values.dropdownChoice === "new") {
        await handleCreateAndAssignAutoinstallFile(
          values.contents,
          values.filename,
        );
      } else if (values.selectedAutoinstallFile) {
        await handleAssignExistingAutoinstallFile(
          values.selectedAutoinstallFile,
        );
      }
    },
  });

  const { autoinstallFiles } = useGetAutoinstallFiles(
    { is_default: true },
    { enabled: formik.values.dropdownChoice === "inherit" },
  );

  const inheritedFile =
    autoinstallFiles.length > 0 ? autoinstallFiles[0] : null;

  const handleInputChange = async ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!files) {
      return;
    }
    const [file] = files;

    await formik.setFieldValue("contents", await file.text());

    if (formik.values.filename) {
      return;
    }

    await formik.setFieldValue("filename", file.name);
  };

  const handleEditorChange = async (value?: string): Promise<void> => {
    await formik.setFieldValue("contents", value);
  };

  const clickFileInput = (): void => {
    inputRef.current?.click();
  };

  const showSnippet =
    (formik.values.dropdownChoice === "assign-existing" &&
      formik.values.selectedAutoinstallFile) ||
    formik.values.dropdownChoice === "inherit";

  return (
    <Form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
      <p>
        This file will only be used during the initial setup of the instance.
        Changing this autoinstall file will not affect instances that are
        already registered in landscape.
      </p>

      <Select
        label="Autoinstall file"
        options={AUTOINSTALL_FILES}
        error={getFormikError(formik, "dropdownChoice")}
        required
        {...formik.getFieldProps("dropdownChoice")}
        onChange={async (e) => {
          formik.resetForm();
          formik.getFieldProps("autoinstallFile").onChange(e);
        }}
      />

      {formik.values.dropdownChoice === "assign-existing" && (
        <AutoInstallFileFormDropdown
          selectedItem={formik.values.selectedAutoinstallFile}
          setSelectedItem={async (item) =>
            await formik.setFieldValue("selectedAutoinstallFile", item)
          }
        />
      )}

      {showSnippet && (
        <CodeSnippet
          className={classNames({
            [classes.code]:
              formik.values.dropdownChoice === "assign-existing" &&
              formik.values.selectedAutoinstallFile,
          })}
          blocks={[
            {
              title: "Code preview",
              code:
                formik.values.dropdownChoice === "assign-existing"
                  ? formik.values.selectedAutoinstallFile?.contents
                  : inheritedFile?.contents,
              wrapLines: true,
              appearance: "numbered",
            },
          ]}
        />
      )}

      {formik.values.dropdownChoice === "new" && (
        <>
          <div className={classes.inputContainer}>
            <Input
              wrapperClassName={classes.input}
              type="text"
              label="File name"
              {...formik.getFieldProps("filename")}
              error={getFormikError(formik, "filename")}
              required
            />
            <span className={classes.inputDescription}>.yaml</span>
          </div>

          <input
            ref={inputRef}
            className="u-hide"
            type="file"
            accept=".yaml"
            onChange={handleInputChange}
          />

          <CodeEditor
            label="Code"
            value={formik.values.contents}
            onChange={handleEditorChange}
            error={getFormikError(formik, "contents")}
            required
            language="yaml"
            headerContent={
              <Button
                className="u-no-margin--bottom"
                appearance="base"
                hasIcon
                onClick={clickFileInput}
                type="button"
              >
                <Icon name="upload" />
                <span>Populate from file</span>
              </Button>
            }
          />
        </>
      )}

      <SidePanelFormButtons
        submitButtonDisabled={
          isUpdatingEmployeeGroups ||
          isAutoinstallFileAdding ||
          (formik.values.dropdownChoice === "assign-existing" &&
            !formik.values.selectedAutoinstallFile)
        }
        submitButtonText="Assign"
      />
    </Form>
  );
};

export default AssignAutoInstallFileForm;
