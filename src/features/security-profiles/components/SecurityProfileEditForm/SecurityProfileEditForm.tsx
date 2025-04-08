import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import moment from "moment";
import { useState, type FC } from "react";
import useSecurityProfileForm from "../../hooks/useSecurityProfileForm";
import type { SecurityProfile } from "../../types";
import classes from "./SecurityProfileEditForm.module.scss";

interface SecurityProfileEditFormProps {
  readonly profile: SecurityProfile;
}

const SecurityProfileEditForm: FC<SecurityProfileEditFormProps> = ({
  profile,
}) => {
  const { notify } = useNotify();

  const { formik, steps } = useSecurityProfileForm({
    initialValues: {
      day_of_month_type: "day-of-month",
      days: [],
      delivery_time: "asap",
      end_date: "",
      end_type: "never",
      every: 1,
      months: [],
      randomize_delivery: "no",
      start_date: moment().format(INPUT_DATE_TIME_FORMAT),
      start_type: "on-a-date",
      tailoring_file: null,
      unit_of_time: "DAILY",
      ...profile,
    },
    onSuccess: (values) => {
      notify.success({
        title: `You have successfully saved changes for ${values.title} security profile.`,
        message:
          values.mode == "audit"
            ? "The changes applied will affect instances associated with this profile."
            : values.mode == "fix-audit"
              ? "The changes made will be applied after running the profile, which has been successfully initiated. It will apply remediation fixes on associated instances and generate an audit."
              : "The changes made will be applied after running the profile, which has been successfully initiated. It will apply remediation fixes on associated instances, restart them, and generate an audit.",
      });
    },
  });

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  const finishSubmit = () => {
    formik.handleSubmit();
  };

  const startSubmit = () => {
    if (formik.values.mode == "audit") {
      finishSubmit();
      return;
    }

    setIsReadyToSubmit(true);
  };

  const goBack = () => {
    setIsReadyToSubmit(false);
  };

  if (isReadyToSubmit) {
    const step = steps[steps.length - 1];

    return (
      <>
        <p>{step.description}</p>

        {step.content}

        <SidePanelFormButtons
          onBackButtonPress={goBack}
          onSubmit={finishSubmit}
          submitButtonDisabled={!!step.isLoading}
          submitButtonLoading={step.isLoading}
          submitButtonText="Save changes"
        />
      </>
    );
  }

  return (
    <>
      {steps[0].content}

      {steps.slice(1, -1).map((step, key) => {
        return (
          <div className={classes.container} key={key}>
            {step.content}
          </div>
        );
      })}

      <SidePanelFormButtons
        onSubmit={startSubmit}
        submitButtonDisabled={!formik.isValid}
        submitButtonLoading={steps.some((step) => step.isLoading)}
        submitButtonText="Save changes"
      />
    </>
  );
};

export default SecurityProfileEditForm;
