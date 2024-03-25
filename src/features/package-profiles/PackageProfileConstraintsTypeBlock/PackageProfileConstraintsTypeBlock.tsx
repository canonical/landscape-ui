import { FC } from "react";
import { Select } from "@canonical/react-components";
import { SelectOption } from "@/types/SelectOption";
import { CONSTRAINTS_TYPE_OPTIONS } from "@/features/package-profiles/PackageProfileConstraintsTypeBlock/constants";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import { FormikContextType } from "formik";
import { AddFormProps } from "@/features/package-profiles/types";
import { FileUpload } from "@canonical/maas-react-components";
import classes from "./PackageProfileConstraintsTypeBlock.module.scss";

interface PackageProfileConstraintsTypeBlockProps {
  formik: FormikContextType<AddFormProps>;
}

const PackageProfileConstraintsTypeBlock: FC<
  PackageProfileConstraintsTypeBlockProps
> = ({ formik }) => {
  const debug = useDebug();
  const { getInstancesQuery } = useInstances();

  const { data: getInstancesQueryResult, error: getInstancesQueryError } =
    getInstancesQuery({}, { refetchOnMount: false });

  if (getInstancesQueryError) {
    debug(getInstancesQueryError);
  }

  const instanceOptions: SelectOption[] =
    getInstancesQueryResult?.data.results.map(({ id, title }) => ({
      label: title,
      value: `${id}`,
    })) ?? [];

  instanceOptions.unshift({ label: "Select instance", value: "" });

  const handleFileUpload = async (files: File[]) => {
    await formik.setFieldValue("csvFile", files[0]);
    const material = await files[0].text();
    await formik.setFieldValue("material", material);
  };

  const handleRemoveFile = async () => {
    await formik.setFieldValue("csvFile", null);
    await formik.setFieldValue("material", "");
    await formik.setFieldValue("isCsvFileParsed", false);
  };

  return (
    <div className={classes.container}>
      <Select
        label="Package constraints"
        required
        options={CONSTRAINTS_TYPE_OPTIONS}
        {...formik.getFieldProps("constraintsType")}
        error={
          formik.touched.constraintsType && formik.errors.constraintsType
            ? formik.errors.constraintsType
            : undefined
        }
      />

      {formik.values.constraintsType === "instance" && (
        <Select
          label="Instance"
          required={formik.values.constraintsType === "instance"}
          options={instanceOptions}
          {...formik.getFieldProps("instanceId")}
          error={
            formik.touched.instanceId && formik.errors.instanceId
              ? formik.errors.instanceId
              : undefined
          }
        />
      )}

      {formik.values.constraintsType === "material" && (
        <FileUpload
          label="Upload constraints"
          help={
            'File should be formatted as either a package profile CSV file or the output of running "dpkg --get-selections" on a computer with desired packages installed.'
          }
          maxFiles={1}
          accept={{ "text/csv": [".csv"] }}
          files={formik.values.csvFile ? [formik.values.csvFile] : []}
          onFileUpload={handleFileUpload}
          removeFile={handleRemoveFile}
          error={
            (formik.touched.csvFile && formik.errors.csvFile) ||
            (formik.touched.material && formik.errors.material) ||
            undefined
          }
          rejectedFiles={[]}
          removeRejectedFile={() => undefined}
        />
      )}
    </div>
  );
};

export default PackageProfileConstraintsTypeBlock;
