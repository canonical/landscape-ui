import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import classNames from "classnames";
import moment from "moment";
import type { FC } from "react";
import { useEffect, useState } from "react";
import useSecurityProfileForm from "../../hooks/useSecurityProfileForm";
import type { SecurityProfileAddFormValues } from "../../types/SecurityProfileAddFormValues";
import { phrase } from "./helpers";
import classes from "./SecurityProfileAddForm.module.scss";

interface SecurityProfileAddFormProps {
  readonly onSuccess: (values: SecurityProfileAddFormValues) => void;
}

const SecurityProfileAddForm: FC<SecurityProfileAddFormProps> = ({
  onSuccess,
}) => {
  const { notify } = useNotify();
  const { setSidePanelTitle } = useSidePanel();

  const [step, setStep] = useState(0);

  const { formik, steps } = useSecurityProfileForm({
    initialValues: {
      all_computers: false,
      access_group: "global",
      day_of_month_type: "day-of-month",
      days: [],
      delivery_time: "asap",
      end_date: "",
      end_type: "never",
      every: 7,
      months: [],
      randomize_delivery: "no",
      start_date: moment().format(INPUT_DATE_TIME_FORMAT),
      start_type: "",
      tags: [],
      tailoring_file: null,
      title: "",
      unit_of_time: "DAILY",
    },
    onSuccess: (values) => {
      const notificationMessageParts = ["perform an initial run"];

      if (values.mode != "audit") {
        notificationMessageParts.push(
          "apply remediation fixes on associated instances",
        );
      }

      if (values.mode == "fix-restart-audit") {
        notificationMessageParts.push("restart them");
      }

      notificationMessageParts.push("generate an audit");

      notify.success({
        title: `You have successfully created ${values.title} security profile.`,
        message: `This profile will ${phrase(notificationMessageParts)}.`,
        actions: [
          {
            label: "View details",
            onClick: () => {
              console.warn("PLACEHOLDER");
            },
          },
        ],
      });

      onSuccess(values);
    },
  });

  useEffect(() => {
    setSidePanelTitle(
      <>
        Add security profile
        <small className={classNames(classes.step, "u-text--muted")}>
          Step {step + 1} of {steps.length}
        </small>
      </>,
    );
  }, [step]);

  const goBack = () => {
    setStep(step - 1);
  };

  const submit = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      formik.handleSubmit();
    }
  };

  return (
    <>
      <p>{steps[step].description}</p>

      {steps[step].content}

      <SidePanelFormButtons
        onBackButtonPress={step > 0 ? goBack : undefined}
        onSubmit={submit}
        submitButtonDisabled={steps[step].isLoading || !steps[step].isValid}
        submitButtonLoading={steps[step].isLoading}
        submitButtonText={steps[step].submitButtonText}
      />
    </>
  );
};

export default SecurityProfileAddForm;
