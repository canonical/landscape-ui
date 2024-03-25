import { FormikContextType, FormikTouched } from "formik";
import { DuplicateFormProps } from "@/features/package-profiles/types";

export const handleNextStep = async (
  formik: FormikContextType<DuplicateFormProps>,
  handleStepChange: (step: number) => Promise<void>,
) => {
  const touchedFields: FormikTouched<DuplicateFormProps> = {
    all_computers: true,
    access_group: true,
    description: true,
    tags: true,
    title: true,
  };

  const errors = await formik.setTouched(touchedFields);

  if (
    !errors ||
    !Object.keys(errors).filter((key) => key !== "constraints").length
  ) {
    await handleStepChange(2);
  }
};
