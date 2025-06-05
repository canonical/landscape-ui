import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { DEFAULT_ACCESS_GROUP_NAME, INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import classNames from "classnames";
import moment from "moment";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useAddSecurityProfile } from "../../api";
import { notifyCreation } from "../../helpers";
import useSecurityProfileForm from "../../hooks/useSecurityProfileForm";
import type { SecurityProfileFormValues } from "../../types/SecurityProfileAddFormValues";
import classes from "./SecurityProfileAddForm.module.scss";

interface SecurityProfileAddFormProps {
  readonly onSuccess: (values: SecurityProfileFormValues) => void;
}

const SecurityProfileAddForm: FC<SecurityProfileAddFormProps> = ({
  onSuccess,
}) => {
  const { notify } = useNotify();
  const { setSidePanelTitle } = useSidePanel();

  const { addSecurityProfile, isSecurityProfileAdding } =
    useAddSecurityProfile();

  const [step, setStep] = useState(0);

  const { formik, steps } = useSecurityProfileForm({
    initialValues: {
      all_computers: false,
      access_group: DEFAULT_ACCESS_GROUP_NAME,
      day_of_month_type: "day-of-month",
      days: [],
      delivery_time: "asap",
      end_date: "",
      end_type: "never",
      every: 7,
      months: [],
      randomize_delivery: "no",
      restart_deliver_delay_window: 1,
      restart_deliver_delay: 1,
      start_date: moment().utc().format(INPUT_DATE_TIME_FORMAT),
      start_type: "on-a-date",
      tags: [],
      tailoring_file: null,
      title: "",
      unit_of_time: "DAILY",
    },
    mutate: async (values) => {
      addSecurityProfile({
        access_group: values.access_group,
        all_computers: values.all_computers,
        benchmark: values.benchmark,
        mode: values.mode,
        restart_deliver_delay: values.restart_deliver_delay,
        restart_deliver_delay_window: values.restart_deliver_delay_window,
        schedule: values.schedule,
        start_date: values.start_date,
        tags: values.tags,
        tailoring_file: values.tailoring_file,
        title: values.title,
      });
    },
    onSuccess: (values) => {
      notifyCreation(values, notify);
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
        hasBackButton={step > 0}
        onBackButtonPress={step > 0 ? goBack : undefined}
        onSubmit={submit}
        submitButtonDisabled={
          steps[step].isLoading ||
          !steps[step].isValid ||
          isSecurityProfileAdding
        }
        submitButtonLoading={steps[step].isLoading || isSecurityProfileAdding}
        submitButtonText={steps[step].submitButtonText}
      />
    </>
  );
};

export default SecurityProfileAddForm;
