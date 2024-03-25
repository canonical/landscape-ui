import { FormikContextType, FormikTouched } from "formik";
import { AddFormProps } from "@/features/package-profiles/types";
import { PackageProfileConstraint } from "@/features/package-profiles/types/PackageProfile";

export const handleNextStep = async (
  formik: FormikContextType<AddFormProps>,
  parseConstraints: () => Promise<void>,
  instanceConstraints: PackageProfileConstraint[],
  handleStepChange: (step: number) => Promise<void>,
) => {
  const touchedFields: FormikTouched<AddFormProps> = {
    all_computers: true,
    access_group: true,
    constraintsType: true,
    description: true,
    tags: true,
    title: true,
  };

  if (formik.values.constraintsType === "material") {
    touchedFields.constraints = [];
    touchedFields.csvFile = true;
    touchedFields.material = true;
  } else if (formik.values.constraintsType === "instance") {
    touchedFields.constraints = [];
    touchedFields.instanceId = true;
  }

  if (
    !formik.values.isCsvFileParsed &&
    formik.values.constraintsType === "material"
  ) {
    const materialError = await formik.validateField("material");

    if (!materialError) {
      await parseConstraints();
    }
  } else if (formik.values.constraintsType === "instance") {
    await formik.setFieldValue("constraints", instanceConstraints);
  }

  const errors = await formik.setTouched(touchedFields);

  if (
    !errors ||
    !Object.keys(errors).filter((key) => key !== "constraints").length
  ) {
    await handleStepChange(2);
  }
};
