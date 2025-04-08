import FileInput from "@/components/form/FileInput";
import RadioGroup from "@/components/form/RadioGroup";
import ScheduleBlock from "@/components/form/ScheduleBlock/components/ScheduleBlock";
import { DAY_OPTIONS } from "@/components/form/ScheduleBlock/components/ScheduleBlockBase/constants";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Flow from "@/components/layout/Flow";
import Indent from "@/components/layout/Indent";
import InfoItem from "@/components/layout/InfoItem";
import LabelWithDescription from "@/components/layout/LabelWithDescription";
import { DISPLAY_DATE_TIME_FORMAT, INPUT_DATE_TIME_FORMAT } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useEnv from "@/hooks/useEnv";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  CustomSelect,
  Input,
  Notification,
  Row,
  Select,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import moment from "moment";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useAddSecurityProfile } from "../../api";
import useAssociationStep from "../../hooks/useAssociationStep";
import type { SecurityProfileAddFormValues } from "../../types/SecurityProfileAddFormValues";
import classes from "./SecurityProfileAddForm.module.scss";
import { phrase } from "./helpers";

interface SecurityProfileAddFormProps {
  readonly currentDate: string;
  readonly onSubmit: (values: SecurityProfileAddFormValues) => void;
}

const SecurityProfileAddForm: FC<SecurityProfileAddFormProps> = ({
  currentDate,
  onSubmit,
}) => {
  const debug = useDebug();
  const { isSelfHosted } = useEnv();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelTitle } = useSidePanel();

  const { addSecurityProfile, isSecurityProfileAdding } =
    useAddSecurityProfile();
  const { getAccessGroupQuery } = useRoles();

  const formik = useFormik<SecurityProfileAddFormValues>({
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
      start_date: currentDate,
      start_type: "",
      tags: [],
      tailoring_file: null,
      title: "",
      unit_of_time: "DAILY",
    },

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

      start_date: Yup.string()
        .required("This field is required.")
        .test({
          test: (start_date) => moment(start_date).isSameOrAfter(moment()),
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
            `UNTIL=${moment(values.end_date).utc().format("YYYYMMDDTHHmmss")}Z`,
          );
        }
      } else {
        scheduleRuleParts.push("COUNT=1");
      }

      try {
        await addSecurityProfile({
          access_group: values.access_group,
          all_computers: values.all_computers,
          benchmark: values.benchmark,
          mode: values.mode,
          schedule: scheduleRuleParts.join(";"),
          start_date: `${moment(values.start_date)
            .utc()
            .format(INPUT_DATE_TIME_FORMAT)}Z`,
          tags: values.all_computers ? undefined : values.tags,
          tailoring_file: await values.tailoring_file?.text(),
          title: values.title,
        });
      } catch (error) {
        debug(error);
        return;
      }

      closeSidePanel();

      const notificationMessageParts = ["perform an initial run"];

      if (formik.values.mode != "audit") {
        notificationMessageParts.push(
          "apply remediation fixes on associated instances",
        );
      }

      if (formik.values.mode == "fix-restart-audit") {
        notificationMessageParts.push("restart them");
      }

      notificationMessageParts.push("generate an audit");

      notify.success({
        title: `You have successfully created ${values.title} security profile`,
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

      onSubmit(values);
    },
  });

  const {
    data: getAccessGroupQueryResponse,
    isLoading: isLoadingAccessGroups,
  } = getAccessGroupQuery();

  const associationStep = useAssociationStep(formik);

  const [step, setStep] = useState(0);

  const handleFileUpload = async (files: File[]) => {
    await formik.setFieldValue("tailoring_file", files[0]);
  };

  const removeFile = async () => {
    await formik.setFieldValue("tailoring_file", null);
  };

  const steps: {
    isLoading?: boolean;
    isValid?: boolean;
    description: string;
    content: ReactNode;
    submitButtonText: string;
  }[] = [
    {
      isValid: !formik.errors.title && formik.touched.title,
      description:
        "Choose a descriptive profile name and the right access group for your security profile.",
      content: (
        <>
          <Input
            type="text"
            label="Profile name"
            {...formik.getFieldProps("title")}
            error={getFormikError(formik, "title")}
            required
          />

          <Select
            label="Access group"
            options={(getAccessGroupQueryResponse?.data ?? []).map((group) => ({
              label: group.title,
              value: group.name,
            }))}
            {...formik.getFieldProps("access_group")}
            error={getFormikError(formik, "access_group")}
            required
            disabled={isLoadingAccessGroups}
          />

          {isSelfHosted && (
            <Input
              type="text"
              label="Audit retention"
              required
              disabled
              value="PLACEHOLDER"
              help={
                <>
                  You can change this limit in the Landscape server
                  configuration file.
                  <br />
                  <a href="PLACEHOLDER" target="_blank" rel="noreferrer">
                    learn more
                  </a>
                </>
              }
            />
          )}
        </>
      ),
      submitButtonText: "Next",
    },

    {
      isValid: !formik.errors.benchmark && !formik.errors.mode,
      description:
        "Select a security profile benchmark, choose the profile mode, and optionally upload a tailoring file to customize the security profile.",
      content: (
        <>
          <Notification severity="caution" title="Changes restricted:" inline>
            After profile creation, the security profile benchmark and mode
            cannot be changed. Please review before proceeding.
          </Notification>

          <CustomSelect
            label="Base profile"
            options={[
              {
                label: (
                  <LabelWithDescription
                    className="u-no-padding--top"
                    label="CIS Level 1 Workstation"
                    description="Center for Internet Security"
                    link="https://ubuntu.com/security/cis"
                  />
                ),
                value: "cis_level1_workstation",
                text: "CIS Level 1 Workstation",
              },
              {
                label: (
                  <LabelWithDescription
                    className="u-no-padding--top"
                    label="CIS Level 1 Server"
                    description="Center for Internet Security"
                    link="https://ubuntu.com/security/cis"
                  />
                ),
                value: "cis_level1_server",
                text: "CIS Level 1 Server",
              },
              {
                label: (
                  <LabelWithDescription
                    className="u-no-padding--top"
                    label="CIS Level 2 Workstation"
                    description="Center for Internet Security"
                    link="https://ubuntu.com/security/cis"
                  />
                ),
                value: "cis_level2_workstation",
                text: "CIS Level 2 Workstation",
              },
              {
                label: (
                  <LabelWithDescription
                    className="u-no-padding--top"
                    label="CIS Level 2 Server"
                    description="Center for Internet Security"
                    link="https://ubuntu.com/security/cis"
                  />
                ),
                value: "cis_level2_server",
                text: "CIS Level 2 Server",
              },
              {
                label: (
                  <LabelWithDescription
                    className="u-no-padding--top"
                    label="DISA-STIG"
                    description="Defense Information System Agency (DISA) for the U.S. Department of Defense (DoD)"
                    link="https://ubuntu.com/security/disa-stig"
                  />
                ),
                value: "disa_stig",
                text: "DISA-STIG",
              },
            ]}
            value={formik.values.benchmark ?? ""}
            onChange={async (value) => formik.setFieldValue("benchmark", value)}
            required
            searchable="never"
          />

          <CustomSelect
            label="Mode"
            options={[
              {
                label: (
                  <LabelWithDescription
                    className="u-no-padding--top"
                    label="Audit only"
                    description="Generates an audit without applying any fixes or remediation."
                  />
                ),
                value: "audit",
                text: "Audit only",
              },
              {
                label: (
                  <LabelWithDescription
                    className="u-no-padding--top"
                    label="Fix and audit"
                    description="Applies fixes and generates an audit after remediation."
                  />
                ),
                value: "fix-audit",
                text: "Fix and audit",
              },
              {
                label: (
                  <LabelWithDescription
                    className="u-no-padding--top"
                    label="Fix, restart, audit"
                    description="Applies fixes, requires a machine restart, and generates an
                  audit after remediation."
                  />
                ),
                value: "fix-restart-audit",
                text: "Fix, restart, audit",
              },
            ]}
            value={formik.values.mode ?? ""}
            onChange={async (value) => formik.setFieldValue("mode", value)}
            required
          />

          <FileInput
            label="Upload tailoring file"
            accept=".xml"
            {...formik.getFieldProps("tailoring_file")}
            help={
              <>
                Customize your security profile by adjusting or disabling rules
                to fit your system while staying compliant.
                <br />
                Max file size: 5mb. Supported format: .xml.
              </>
            }
            onFileRemove={removeFile}
            onFileUpload={handleFileUpload}
          />
        </>
      ),
      submitButtonText: "Next",
    },

    {
      isValid:
        !formik.errors.start_type &&
        !formik.errors.start_date &&
        !formik.errors.every &&
        !formik.errors.end_date,
      description:
        "Add a schedule for the security profile. Select a specific date or a recurring schedule for continuous audit generation.",
      content: (
        <>
          <ScheduleBlock currentDate={currentDate} formik={formik} />

          {formik.values.mode == "fix-restart-audit" && (
            <>
              <LabelWithDescription
                label="Restart schedule"
                description="You can choose when to perform the required restart."
              />

              <Indent>
                <RadioGroup
                  field={"delivery_time"}
                  formik={formik}
                  label="Delivery time"
                  inputs={[
                    { label: "As soon as possible", key: "asap" },
                    { label: "Scheduled", key: "scheduled" },
                  ]}
                />

                <RadioGroup
                  field={"randomize_delivery"}
                  formik={formik}
                  label="Randomize delivery over a time window"
                  inputs={[
                    { label: "No", key: "no" },
                    { label: "Yes", key: "yes" },
                  ]}
                />
              </Indent>
            </>
          )}
        </>
      ),
      submitButtonText: "Next",
    },

    associationStep,

    {
      isLoading: isSecurityProfileAdding,
      isValid: true,
      description: `To apply your changes, you need to run the profile. This will ${phrase(
        [
          formik.values.mode != "audit" ? "apply fixes" : null,
          formik.values.mode == "fix-restart-audit"
            ? "restart instances"
            : null,
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
            formik.values.mode == "fix-restart-audit"
              ? {
                  header: "Restart instances",
                  description:
                    "To complete the fixes, instances must be restarted.",
                  iconName: "restart",
                  children: (
                    <>
                      <Row className="u-no-padding">
                        <InfoItem
                          label="Delivery time"
                          value={
                            formik.values.delivery_time == "asap"
                              ? "As soon as possible"
                              : "Scheduled"
                          }
                        />
                      </Row>

                      <Row className="u-no-padding">
                        <InfoItem
                          label="Randomize delivery over a time window"
                          value={
                            formik.values.randomize_delivery ? "Yes" : "No"
                          }
                        />
                      </Row>
                    </>
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
    },
  ];

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
