import Flow from "@/components/layout/Flow";
import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { pluralize } from "@/utils/_helpers";
import type { FormikContextType } from "formik";
import moment from "moment";
import { phrase } from "../helpers";
import type { SecurityProfileFormValues } from "../types/SecurityProfileAddFormValues";

export default function useSecurityProfileFormConfirmationStep<
  T extends SecurityProfileFormValues,
>(formik: FormikContextType<T>) {
  return {
    isValid: true,
    isLoading: false,
    description: `This will ${phrase(
      [
        formik.values.mode != "audit" ? "apply fixes" : null,
        formik.values.mode == "audit-fix-restart" ? "restart instances" : null,
        "generate an audit",
      ].filter((string) => string != null),
    )} on the selected next run date.`,
    content: (
      <Flow
        cards={[
          {
            header: "Next run date",
            description: (
              <>
                Security profile&apos;s next run date arrives
                <br />
                {moment(formik.values.start_date).format(
                  `${DISPLAY_DATE_TIME_FORMAT}`,
                )}
              </>
            ),
            iconName: "revisions",
          },
          formik.values.mode != "audit"
            ? {
                header: "Apply fixes",
                description:
                  "Security profile will attempt to apply remediations before the next audit, helping maintain instances' compliance with the security profile.",
                iconName: "open-terminal",
              }
            : null,
          formik.values.mode == "audit-fix-restart"
            ? {
                header: "Restart instances",
                description:
                  "To complete the fixes, instances must be restarted.",
                iconName: "restart",
                children: (
                  <InfoGrid>
                    <InfoGrid.Item
                      label="Delivery time"
                      large
                      value={
                        formik.values.delivery_time === "asap"
                          ? "As soon as possible"
                          : `Delayed by ${formik.values.restart_deliver_delay} ${pluralize(
                              formik.values.restart_deliver_delay,
                              "hour",
                            )}`
                      }
                    />

                    <InfoGrid.Item
                      label="Randomize delivery over a time window"
                      large
                      value={
                        formik.values.randomize_delivery === true
                          ? `Yes, over ${formik.values.deliver_delay_window} ${pluralize(
                              formik.values.deliver_delay_window,
                              "minute",
                            )}`
                          : "No"
                      }
                    />
                  </InfoGrid>
                ),
              }
            : null,
          {
            header: "Generate an audit",
            description:
              "Security profile will generate an audit for all instances associated, aggregated in the audit view to show pass/fail results and allow detailed inspection.",
            iconName: "file-blank",
          },
        ].filter((card) => card != null)}
      />
    ),
    submitButtonText: "Add",
  };
}
