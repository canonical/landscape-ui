import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import SidePanel from "@/components/layout/SidePanel";
import { DEFAULT_ACCESS_GROUP_NAME, INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import classNames from "classnames";
import moment from "moment";
import type { FC } from "react";
import { useState } from "react";
import { useAddSecurityProfile } from "../../api";
import { notifyCreation } from "../../helpers";
import useSecurityProfileForm from "../../hooks/useSecurityProfileForm";
import type { SecurityProfileFormValues } from "../../types/SecurityProfileAddFormValues";
import classes from "./SecurityProfileAddSidePanel.module.scss";

interface SecurityProfileAddSidePanelProps {
  readonly onSuccess: (values: SecurityProfileFormValues) => void;
}

const SecurityProfileAddSidePanel: FC<SecurityProfileAddSidePanelProps> = ({
  onSuccess,
}) => {
  const { notify } = useNotify();
  const { createPageParamsSetter } = usePageParams();

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
      <SidePanel.Header>
        Add security profile
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
          submitButtonDisabled={
            steps[step].isLoading ||
            !steps[step].isValid ||
            isSecurityProfileAdding
          }
          submitButtonLoading={steps[step].isLoading || isSecurityProfileAdding}
          submitButtonText={steps[step].submitButtonText}
          onCancel={createPageParamsSetter({ sidePath: [] })}
        />
      </SidePanel.Content>
    </>
  );
};

export default SecurityProfileAddSidePanel;
