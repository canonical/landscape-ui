import AccessGroupSelect from "@/components/form/AccessGroupSelect";
import AssociationBlock from "@/components/form/AssociationBlock";
import FileInput from "@/components/form/FileInput";
import RadioGroup from "@/components/form/RadioGroup";
import ScheduleBlock from "@/components/form/ScheduleBlock/components/ScheduleBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import Flow from "@/components/layout/Flow";
import Indent from "@/components/layout/Indent";
import InfoItem from "@/components/layout/InfoItem";
import LabelWithDescription from "@/components/layout/LabelWithDescription";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  CustomSelect,
  Input,
  Notification,
  Row,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import moment from "moment";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useAddSecurityProfile } from "../../api/useAddSecurityProfile";
import type { SecurityProfileAddFormValues } from "../../types/SecurityProfileAddFormValues";
import classes from "./SecurityProfileAddForm.module.scss";
import { VALIDATION_SCHEMA } from "./constants";
import { phrase } from "./helpers";

interface SecurityProfileAddFormProps {
  readonly currentDate: string;
  readonly showNotification: () => void;
}

const SecurityProfileAddForm: FC<SecurityProfileAddFormProps> = ({
  currentDate,
  showNotification,
}) => {
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelTitle } = useSidePanel();

  const { addSecurityProfile } = useAddSecurityProfile();

  const formik = useFormik<SecurityProfileAddFormValues>({
    initialValues: {
      all_computers: false,
      access_group: "",
      delivery_time: "asap",
      end_date: "",
      end_type: "never",
      every: 7,
      on: [],
      randomize_delivery: "no",
      start_date: currentDate,
      start_type: "",
      tags: [],
      tailoring_file: null,
      title: "",
      unit_of_time: "days",
    },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      if (!values.benchmark || !values.mode) {
        return;
      }

      await addSecurityProfile({
        benchmark: values.benchmark,
        mode: values.mode,
        schedule: "",
        start_date: values.start_date,
        title: values.title,
        access_group: values.access_group,
        all_computers: values.all_computers,
        tags: values.tags,
        tailoring_file: await values.tailoring_file?.text(),
      });

      closeSidePanel();

      notify.success({
        title: `You have successfully created ${values.title} security profile`,
        message: `This profile will ${phrase(
          [
            "perform an initial run",
            formik.values.mode != "audit"
              ? "apply remediation fixes on associated instances"
              : null,
            formik.values.mode == "fix-restart-audit" ? "restart them" : null,
            "generate an audit",
          ].filter((string) => string != null),
        )}.`,
        actions: [
          {
            label: "View details",
            onClick: () => undefined,
          },
        ],
      });

      showNotification();
    },
  });

  const [step, setStep] = useState(0);

  const handleFileUpload = async (files: File[]) => {
    await formik.setFieldValue("tailoring_file", files[0]);
  };

  const handleFileRemove = async () => {
    await formik.setFieldValue("tailoring_file", null);
  };

  const steps = [
    {
      isValid:
        !formik.errors.title &&
        formik.touched.title &&
        !formik.errors.access_group,
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

          <AccessGroupSelect formik={formik} />
        </>
      ),
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
            onFileRemove={handleFileRemove}
            onFileUpload={handleFileUpload}
          />
        </>
      ),
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
                    { label: "As soon as possible", value: "asap" },
                    { label: "Scheduled", value: "scheduled" },
                  ]}
                />

                <RadioGroup
                  field={"randomize_delivery"}
                  formik={formik}
                  label="Randomize delivery over a time window"
                  inputs={[
                    { label: "No", value: "no" },
                    { label: "Yes", value: "yes" },
                  ]}
                />
              </Indent>
            </>
          )}
        </>
      ),
    },

    {
      isValid: !formik.errors.tags,
      description:
        "Associate the security profile. Apply it to all instances or limit it to specific instances using a tag.",
      content: <AssociationBlock formik={formik} />,
    },

    {
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

  return (
    <>
      <p>{steps[step].description}</p>
      {steps[step].content}

      <SidePanelFormButtons
        hasBackButton={step > 0}
        onBackButtonPress={() => {
          setStep(step - 1);
        }}
        onSubmit={() => {
          if (step < steps.length - 1) {
            setStep(step + 1);
          } else {
            formik.handleSubmit();
          }
        }}
        submitButtonDisabled={!steps[step].isValid}
        submitButtonText={step < steps.length - 1 ? "Next" : "Add"}
      />
    </>
  );
};

export default SecurityProfileAddForm;
