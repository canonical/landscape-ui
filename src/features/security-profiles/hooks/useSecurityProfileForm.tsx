import { DAY_OPTIONS } from "@/components/form/ScheduleBlock/components/ScheduleBlockBase/constants";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { useFormik } from "formik";
import moment from "moment";
import type { ReactNode } from "react";
import * as Yup from "yup";
import type { SecurityProfile } from "../types";
import type { SecurityProfileFormValues } from "../types/SecurityProfileAddFormValues";
import useSecurityProfileFormAssociationStep from "./useSecurityProfileFormAssociationStep";
import useSecurityProfileFormBenchmarkStep from "./useSecurityProfileFormBenchmarkStep";
import useSecurityProfileFormConfirmationStep from "./useSecurityProfileFormConfirmationStep";
import useSecurityProfileFormNameStep from "./useSecurityProfileFormNameStep";
import useSecurityProfileFormScheduleStep from "./useSecurityProfileFormScheduleStep";

export interface UseSecurityProfileFormProps {
  initialValues: SecurityProfileFormValues;
  mutate: (
    params: Pick<SecurityProfile, "benchmark" | "mode" | "schedule" | "title"> &
      Partial<
        Pick<SecurityProfile, "access_group" | "all_computers" | "tags">
      > & {
        start_date: string;
        restart_deliver_delay_window?: number;
        restart_deliver_delay?: number;
        tailoring_file?: string;
      },
  ) => Promise<unknown>;
  benchmarkStepDisabled?: boolean;
  onSuccess?: (values: SecurityProfileFormValues) => void;
}

const useSecurityProfileForm = ({
  initialValues,
  mutate,
  benchmarkStepDisabled,
  onSuccess = () => undefined,
}: UseSecurityProfileFormProps) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const formik = useFormik<SecurityProfileFormValues>({
    initialValues,

    validateOnMount: true,

    validationSchema: Yup.object().shape({
      benchmark: Yup.string().required("This field is required."),

      end_date: Yup.string().when(
        ["start_date", "start_type", "end_type"],
        ([start_date, start_type, end_type], schema) =>
          start_type == "recurring" && end_type == "on-a-date"
            ? schema.required("This field is required.").test({
                test: (end_date) => {
                  return moment(end_date).isAfter(moment(start_date));
                },
                message: `The end date must be after the start date.`,
              })
            : schema,
      ),

      every: Yup.number().when("start_type", ([start_type], schema) =>
        start_type == "recurring"
          ? schema
              .required("This field is required.")
              .positive("Enter a positive number.")
              .integer("Enter an integer.")
          : schema,
      ),

      mode: Yup.string().required("This field is required."),

      restart_deliver_delay_window: Yup.number().when(
        ["mode", "randomize_delivery"],
        ([mode, randomize_delivery], schema) =>
          mode == "audit-fix-restart" && randomize_delivery == "yes"
            ? schema
                .required("This field is required.")
                .positive("Enter a positive number.")
                .integer("Enter an integer.")
            : schema,
      ),

      restart_deliver_delay: Yup.number().when(
        ["mode", "delivery_time"],
        ([mode, delivery_time], schema) =>
          mode == "audit-fix-restart" && delivery_time == "delayed"
            ? schema
                .required("This field is required.")
                .positive("Enter a positive number.")
                .integer("Enter an integer.")
            : schema,
      ),

      start_date: Yup.string()
        .required("This field is required.")
        .test({
          test: (start_date) =>
            moment(start_date).utc(true).isSameOrAfter(moment()),
          message: `The date must not be in the past.`,
        }),

      start_type: Yup.string().required("This field is required."),

      title: Yup.string().required("This field is required."),
    }),

    onSubmit: async (values) => {
      if (!values.benchmark || !values.mode) {
        return;
      }

      const scheduleRuleParts = [`FREQ=${values.unit_of_time}`];

      if (values.start_type == "recurring") {
        scheduleRuleParts.push(`INTERVAL=${values.every}`);

        switch (values.unit_of_time) {
          case "WEEKLY": {
            scheduleRuleParts.push(`BYDAY=${values.days.join(",")}`);
            break;
          }

          case "MONTHLY": {
            const date = new Date(values.start_date);
            const dayOfMonth = date.getDate();

            switch (values.day_of_month_type) {
              case "day-of-month": {
                scheduleRuleParts.push(`BYMONTHDAY=${dayOfMonth}`);
                break;
              }

              case "day-of-week": {
                const ordinalWeek = Math.ceil(dayOfMonth / 7);
                scheduleRuleParts.push(
                  `BYDAY=${ordinalWeek > 4 ? -1 : ordinalWeek}${DAY_OPTIONS[date.getDay()].value}`,
                );
                break;
              }
            }

            break;
          }

          case "YEARLY": {
            scheduleRuleParts.push(`BYMONTH=${values.months.join(",")}`);
            break;
          }
        }

        if (values.end_type == "on-a-date") {
          scheduleRuleParts.push(
            `UNTIL=${moment(values.end_date).format("YYYYMMDDTHHmmss")}Z`,
          );
        }
      } else {
        scheduleRuleParts.push("COUNT=1");
      }

      try {
        await mutate({
          access_group:
            values.access_group == "global" ? undefined : values.access_group,
          all_computers: values.all_computers || undefined,
          benchmark: values.benchmark,
          mode: values.mode,
          restart_deliver_delay_window:
            values.mode == "audit-fix-restart"
              ? values.restart_deliver_delay_window
              : undefined,
          restart_deliver_delay:
            values.mode == "audit-fix-restart"
              ? values.restart_deliver_delay
              : undefined,
          schedule: scheduleRuleParts.join(";"),
          start_date: `${moment(values.start_date).format(
            INPUT_DATE_TIME_FORMAT,
          )}Z`,
          tags: values.all_computers ? undefined : values.tags,
          tailoring_file: await values.tailoring_file?.text(),
          title: values.title,
        });
      } catch (error) {
        debug(error);
        return;
      }

      closeSidePanel();

      onSuccess(values);
    },
  });

  const nameStep = useSecurityProfileFormNameStep(formik);
  const benchmarkStep = useSecurityProfileFormBenchmarkStep(
    formik,
    benchmarkStepDisabled,
  );
  const scheduleStep = useSecurityProfileFormScheduleStep(formik);
  const associationStep = useSecurityProfileFormAssociationStep(formik);
  const confirmationStep = useSecurityProfileFormConfirmationStep(formik);

  const steps: {
    isLoading?: boolean;
    isValid?: boolean;
    description: string;
    content: ReactNode;
    submitButtonText: string;
  }[] = [
    nameStep,
    benchmarkStep,
    scheduleStep,
    associationStep,
    confirmationStep,
  ];

  return { formik, steps };
};

export default useSecurityProfileForm;
