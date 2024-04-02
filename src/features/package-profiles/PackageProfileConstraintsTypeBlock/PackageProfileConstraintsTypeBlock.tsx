import { FormikContextType } from "formik";
import { FC } from "react";
import { Select } from "@canonical/react-components";
import FileInput from "@/components/form/FileInput";
import PackageProfileConstraintsBlock from "@/features/package-profiles/PackageProfileConstraintsBlock";
import { AddFormProps } from "@/features/package-profiles/types";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import { SelectOption } from "@/types/SelectOption";
import { CONSTRAINTS_TYPE_OPTIONS } from "./constants";
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
    getInstancesQuery();

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
          {...formik.getFieldProps("source_computer_id")}
          error={
            formik.touched.source_computer_id &&
            formik.errors.source_computer_id
              ? formik.errors.source_computer_id
              : undefined
          }
        />
      )}

      {formik.values.constraintsType === "material" && (
        <FileInput
          label="Upload constraints"
          accept=".csv"
          {...formik.getFieldProps("csvFile")}
          onFileRemove={handleRemoveFile}
          onFileUpload={handleFileUpload}
          help={
            'File should be formatted as either a package profile CSV file or the output of running "dpkg --get-selections" on a computer with desired packages installed.'
          }
          error={
            (formik.touched.csvFile && formik.errors.csvFile) ||
            (formik.touched.material && formik.errors.material) ||
            undefined
          }
        />
      )}

      {formik.values.constraintsType === "manual" && (
        <PackageProfileConstraintsBlock formik={formik} />
      )}
    </div>
  );
};

export default PackageProfileConstraintsTypeBlock;
