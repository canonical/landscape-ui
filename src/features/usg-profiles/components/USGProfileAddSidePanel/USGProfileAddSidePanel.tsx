import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import { DEFAULT_ACCESS_GROUP_NAME, INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import classNames from "classnames";
import moment from "moment";
import type { FC } from "react";
import { useState } from "react";
import type { FormikErrors } from "formik";
import { useAddUsgProfile } from "../../api";
import { notifyCreation } from "../../helpers";
import useUsgProfileForm from "../../hooks/useUsgProfileForm";
import classes from "./USGProfileAddSidePanel.module.scss";
import type { StepIndex } from "./types";
import type { USGProfileFormValues } from "../../types/USGProfileAddFormValues";

interface USGProfileAddSidePanelProps {
  readonly showRetentionNotification: () => void;
}

const STEP_FIELDS: Record<StepIndex, (keyof USGProfileFormValues)[]> = {
  0: ["title"],
  1: ["benchmark", "mode"],
  2: [
    "start_type",
    "start_date",
    "every",
    "end_date",
    "deliver_delay_window",
    "restart_deliver_delay",
  ],
  3: [],
  4: [],
};

const USGProfileAddSidePanel: FC<USGProfileAddSidePanelProps> = ({
  showRetentionNotification,
}) => {
  const { notify } = useNotify();
  const { closeSidePanel } = usePageParams();

  const { addUsgProfile, isUsgProfileAdding } = useAddUsgProfile();

  const [step, setStep] = useState<StepIndex>(0);

  const { formik, steps } = useUsgProfileForm({
    formMode: "add",
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
      randomize_delivery: false,
      deliver_delay_window: 1,
      restart_deliver_delay: 1,
      start_date: moment().utc().format(INPUT_DATE_TIME_FORMAT),
      start_type: "on-a-date",
      tags: [],
      tailoring_file: null,
      title: "",
      unit_of_time: "DAILY",
    },
    mutate: async (values) => {
      addUsgProfile({
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
      showRetentionNotification();
    },
  });

  const goBack = () => {
    if (step !== 0) {
      setStep((step - 1) as StepIndex);
    }
  };

  const touchStepFields = async () => {
    await Promise.all(
      STEP_FIELDS[step].map((field) =>
        formik.setFieldTouched(field, true, false),
      ),
    );
  };

  const stepHasValidationErrors = (
    errors: FormikErrors<USGProfileFormValues>,
  ) => {
    return STEP_FIELDS[step].some((field) => !!errors[field]);
  };

  const submit = async () => {
    const errors = await formik.validateForm();

    if (stepHasValidationErrors(errors)) {
      await touchStepFields();
      return;
    }

    if (step < steps.length - 1) {
      setStep((step + 1) as StepIndex);
    } else {
      formik.handleSubmit();
    }
  };

  return (
    <>
      <SidePanel.Header>
        Add USG profile
        <small className={classNames(classes.step, "u-text--muted")}>
          Step {step + 1} of {steps.length}
        </small>
      </SidePanel.Header>
      <SidePanel.Content>
        <p>{steps[step].description}</p>
        {steps[step].content}
        <SidePanelFormButtons
          hasBackButton={step > 0}
          onBackButtonPress={step > 0 ? goBack : undefined}
          onSubmit={submit}
          submitButtonLoading={steps[step].isLoading || isUsgProfileAdding}
          submitButtonText={steps[step].submitButtonText}
          onCancel={closeSidePanel}
        />
      </SidePanel.Content>
    </>
  );
};

export default USGProfileAddSidePanel;
