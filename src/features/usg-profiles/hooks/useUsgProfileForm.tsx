import { randomizationValidationSchema } from "@/components/form/DeliveryScheduling/helpers";
import { DAY_OPTIONS } from "@/components/form/ScheduleBlock/components/ScheduleBlockBase/constants";
import { DEFAULT_ACCESS_GROUP_NAME, INPUT_DATE_TIME_FORMAT } from "@/constants";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { useFormik } from "formik";
import moment from "moment";
import type { ReactNode } from "react";
import * as Yup from "yup";
import { getDayOfWeek } from "../helpers";
import type { USGProfile } from "../types";
import type { USGProfileFormValues } from "../types/USGProfileAddFormValues";
import useUsgProfileFormAssociationStep from "./useUsgProfileFormAssociationStep";
import useUsgProfileFormBenchmarkStep from "./useUsgProfileFormBenchmarkStep";
import useUsgProfileFormConfirmationStep from "./useUsgProfileFormConfirmationStep";
import useUsgProfileFormNameStep from "./useUsgProfileFormNameStep";
import useUsgProfileFormScheduleStep from "./useUsgProfileFormScheduleStep";

export interface UseUSGProfileFormProps {
  initialValues: USGProfileFormValues;
  mutate: (
    params: Pick<USGProfile, "benchmark" | "mode" | "schedule" | "title"> &
      Partial<Pick<USGProfile, "access_group" | "all_computers" | "tags">> & {
        start_date: string;
        restart_deliver_delay_window?: number;
        restart_deliver_delay?: number;
        tailoring_file?: string;
      },
  ) => Promise<unknown>;
  benchmarkStepDisabled?: boolean;
  onSuccess?: (values: USGProfileFormValues) => void;
  formMode: "add" | "edit";
}

const useUsgProfileForm = ({
  initialValues,
  mutate,
  benchmarkStepDisabled,
  onSuccess = () => undefined,
  formMode,
}: UseUSGProfileFormProps) => {
  const debug = useDebug();
  const { closeSidePanel } = usePageParams();
  const formik = useFormik<USGProfileFormValues>({
    initialValues,

    validateOnMount: true,

    validationSchema: Yup.object().shape({
      ...randomizationValidationSchema,

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
              .when("unit_of_time", ([unit_of_time]) =>
                unit_of_time === "DAILY"
                  ? schema.min(7, "Enter an interval of at least 7 days.")
                  : schema,
              )
          : schema,
      ),

      mode: Yup.string().required("This field is required."),

      deliver_delay_window: Yup.number().when(
        ["mode", "randomize_delivery"],
        ([mode, randomize_delivery], schema) =>
          mode == "audit-fix-restart" && randomize_delivery == true
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

      start_date: Yup.string().required("This field is required."),

      title: Yup.string().required("This field is required."),
    }),

    onSubmit: async (values) => {
      if (!values.benchmark || !values.mode) {
        return;
      }

      const scheduleRuleParts = [];

      if (values.start_type == "recurring") {
        scheduleRuleParts.push(
          `FREQ=${values.unit_of_time}`,
          `INTERVAL=${values.every}`,
        );

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
                const day = getDayOfWeek(date);

                scheduleRuleParts.push(
                  `BYDAY=${ordinalWeek > 4 ? -1 : ordinalWeek}${DAY_OPTIONS[day].value}`,
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
        scheduleRuleParts.push("FREQ=WEEKLY", "COUNT=1");
      }

      try {
        await mutate({
          access_group:
            values.access_group == DEFAULT_ACCESS_GROUP_NAME
              ? undefined
              : values.access_group,
          all_computers: values.all_computers || undefined,
          benchmark: values.benchmark,
          mode: values.mode,
          restart_deliver_delay_window:
            values.mode == "audit-fix-restart"
              ? values.deliver_delay_window
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

  const nameStep = useUsgProfileFormNameStep(formik, formMode);
  const benchmarkStep = useUsgProfileFormBenchmarkStep(
    formik,
    benchmarkStepDisabled,
  );
  const scheduleStep = useUsgProfileFormScheduleStep(formik);
  const associationStep = useUsgProfileFormAssociationStep(formik);
  const confirmationStep = useUsgProfileFormConfirmationStep(formik);

  const steps = [
    nameStep,
    benchmarkStep,
    scheduleStep,
    associationStep,
    confirmationStep,
  ] as const satisfies {
    isLoading: boolean;
    isValid: boolean;
    description: string;
    content: ReactNode;
    submitButtonText: string;
  }[];

  return { formik, steps };
};

export default useUsgProfileForm;
