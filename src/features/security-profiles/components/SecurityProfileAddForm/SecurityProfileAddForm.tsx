import AssociationBlock from "@/components/form/AssociationBlock";
import FileInput from "@/components/form/FileInput";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import InfoItem from "@/components/layout/InfoItem";
import { INPUT_DATE_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  CustomSelect,
  Input,
  Notification,
  RadioInput,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import type { SecurityProfileAddFormValues } from "../../types/SecurityProfileAddFormValues";
import FlowCard from "../FlowCard";
import SecurityProfileAccessGroupSelect from "../SecurityProfileAccessGroupSelect";
import SecurityProfileScheduleBlock from "../SecurityProfileScheduleBlock";
import classes from "./SecurityProfileAddForm.module.scss";

const SecurityProfileAddForm = () => {
  const currentDate = moment().format(`${INPUT_DATE_FORMAT}THH:mm`);

  const formik = useFormik<SecurityProfileAddFormValues>({
    initialValues: {
      all_computers: false,
      accessGroup: "",
      baseProfile: "",
      cronSchedule: "",
      deliveryTime: "asap",
      ends: "never",
      mode: "",
      name: "",
      on: [],
      randomizeDelivery: false,
      repeatEvery: 7,
      repeatEveryType: "days",
      schedule: "",
      startDate: currentDate,
      tags: [],
      useCronJobFormat: false,
    },
    onSubmit: () => undefined,
  });

  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelTitle } = useSidePanel();

  const [step, setStep] = useState(0);

  const handleFileRemove = async () => {
    await formik.setFieldValue("tailoringFile", null);
  };

  const handleFileUpload = async (files: File[]) => {
    await formik.setFieldValue("tailoringFile", files[0]);
  };

  const steps = [
    <>
      <p>
        Choose a descriptive profile name and the right access group for your
        security profile.
      </p>

      <Input
        type="text"
        label="Profile name"
        {...formik.getFieldProps("name")}
      />

      <SecurityProfileAccessGroupSelect formik={formik} />
    </>,

    <>
      <p>
        Select a security profile benchmark, choose the profile mode, and
        optionally upload a tailoring file to customize the security profile.
      </p>

      <Notification severity="caution">
        <strong>Changes Restricted:</strong> After profile creation, the
        security profile benchmark and mode cannot be changed. Please review
        before proceeding.
      </Notification>

      <CustomSelect
        label="Base profile"
        options={[
          {
            label: (
              <>
                <p className="u-no-margin--bottom u-no-padding--top">CIS</p>
                <small className={classes.description}>
                  Center for Internet Security
                  <a
                    href="https://ubuntu.com/security/cis"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    learn more
                  </a>
                </small>
              </>
            ),
            value: "cis",
            text: "CIS",
          },
          {
            label: (
              <>
                <p className="u-no-margin--bottom u-no-padding--top">
                  DISA-STIG
                </p>
                <small className={classes.description}>
                  Defense Information System Agency (DISA) for the U.S.
                  Department of Defense (DoD)
                  <a
                    href="https://ubuntu.com/security/disa-stig"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    learn more
                  </a>
                </small>
              </>
            ),
            value: "disa-stig",
            text: "DISA-STIG",
          },
        ]}
        value={formik.values.baseProfile}
        onChange={async (value) => formik.setFieldValue("baseProfile", value)}
      />

      <CustomSelect
        label="Mode"
        options={[
          {
            label: (
              <>
                <p className="u-no-margin--bottom u-no-padding--top">
                  Audit only
                </p>

                <small className={classes.description}>
                  Generates an audit without applying any fixes or remediation.
                </small>
              </>
            ),
            value: "auditOnly",
            text: "Audit only",
          },
          {
            label: (
              <>
                <p className="u-no-margin--bottom u-no-padding--top">
                  Fix and audit
                </p>

                <small className={classes.description}>
                  Applies fixes and generates an audit after remediation.
                </small>
              </>
            ),
            value: "fixAndAudit",
            text: "Fix and audit",
          },
          {
            label: (
              <>
                <p className="u-no-margin--bottom u-no-padding--top">
                  Fix, restart, audit
                </p>

                <small className={classes.description}>
                  Applies fixes, requires a machine restart, and generates an
                  audit after remediation.
                </small>
              </>
            ),
            value: "fixRestartAudit",
            text: "Fix, restart, audit",
          },
        ]}
        value={formik.values.mode}
        onChange={async (value) => formik.setFieldValue("mode", value)}
      />

      {formik.values.mode == "fixRestartAudit" && (
        <div className={classes.indent}>
          <p className="u-no-margin--bottom">
            <strong>Restart schedule</strong>
          </p>

          <small className={classes.description}>
            You can choose when to perform the required restart.
          </small>

          <p className="u-no-margin--bottom">
            <strong>Delivery time</strong>
          </p>

          <div className={classes.radioGroup}>
            <RadioInput
              label="As soon as possible"
              {...formik.getFieldProps("deliveryTime")}
              checked={formik.values.deliveryTime == "asap"}
              onChange={async () =>
                formik.setFieldValue("deliveryTime", "asap")
              }
            />

            <RadioInput
              label="Scheduled"
              {...formik.getFieldProps("deliveryTime")}
              checked={formik.values.deliveryTime == "scheduled"}
              onChange={async () =>
                formik.setFieldValue("deliveryTime", "scheduled")
              }
            />
          </div>

          <p className="u-no-margin--bottom">
            <strong>Randomize delivery over a time window</strong>
          </p>

          <div className={classes.radioGroup}>
            <RadioInput
              label="No"
              {...formik.getFieldProps("randomizeDelivery")}
              checked={!formik.values.randomizeDelivery}
              onChange={async () =>
                formik.setFieldValue("randomizeDelivery", false)
              }
            />

            <RadioInput
              label="Yes"
              {...formik.getFieldProps("randomizeDelivery")}
              checked={formik.values.randomizeDelivery}
              onChange={async () =>
                formik.setFieldValue("randomizeDelivery", true)
              }
            />
          </div>
        </div>
      )}

      <FileInput
        label="Upload tailoring file (optional)"
        accept=".xml"
        {...formik.getFieldProps("tailoringFile")}
        help="Customize your security profile by adjusting or disabling rules to fit your system while staying compliant. Max file size: 5mb. Supported format: .xml."
        onFileRemove={handleFileRemove}
        onFileUpload={handleFileUpload}
      />
    </>,

    <>
      <p>
        Add a schedule for the security profile. Select a specific date or a
        recurring schedule for continuous audit generation.
      </p>

      <CustomSelect
        label="Schedule"
        options={[
          { label: "On a date", value: "onADate" },
          { label: "Recurring", value: "recurring" },
        ]}
        value={formik.values.schedule}
        onChange={async (value) => formik.setFieldValue("schedule", value)}
      />

      <div className={classes.indent}>
        <SecurityProfileScheduleBlock
          currentDate={currentDate}
          formik={formik}
        />
      </div>
    </>,
    <>
      <p>
        Associate the security profile. Apply it to all instances or limit it to
        specific instances using a tag.
      </p>

      <AssociationBlock formik={formik} />
    </>,

    <>
      <p>
        To apply your changes, you need to run the profile. This will{" "}
        {formik.values.mode != "auditOnly" && "apply fixes"}
        {formik.values.mode == "fixRestartAudit" && ", restart instances,"}
        {formik.values.mode != "auditOnly" && " and "}
        generate an audit - on the selected next run date.
      </p>

      <div className={classes.smallCard}>Start</div>

      <div className={classes.line} />

      <FlowCard header="Next run date" iconName="revisions">
        <p className="u-no-margin--bottom u-no-padding--top">
          <small className={classes.description}>
            Security profile&apos;s next run date arrives
          </small>

          <br />

          <small className={classes.description}>12 Mar 2025, 12:00</small>
        </p>
      </FlowCard>

      <div className={classes.line} />

      {formik.values.mode != "auditOnly" && (
        <>
          <FlowCard header="Apply fixes" iconName="open-terminal">
            <p
              className={classNames("u-no-margin--bottom", "u-no-padding--top")}
            >
              <small className={classes.description}>
                Security profile will attempt to apply remediations before the
                next audit, helping maintain instances&apos; compliance with the
                security profile.
              </small>
            </p>
          </FlowCard>

          <div className={classes.line} />
        </>
      )}

      {formik.values.mode == "fixRestartAudit" && (
        <>
          <FlowCard header="Restart instances" iconName="restart">
            <p
              className={classNames("u-no-margin--bottom", "u-no-padding--top")}
            >
              <small className={classes.description}>
                To complete the fixes, instances must be restarted.
              </small>
            </p>

            <InfoItem
              label="Delivery time"
              value={
                formik.values.deliveryTime == "asap"
                  ? "As soon as possible"
                  : "Scheduled"
              }
            />

            <InfoItem
              label="Randomize delivery over a time window"
              value={formik.values.randomizeDelivery ? "Yes" : "No"}
            />
          </FlowCard>

          <div className={classes.line} />
        </>
      )}

      <FlowCard header="Generate an audit" iconName="revisions">
        <p className={classNames("u-no-margin--bottom", "u-no-padding--top")}>
          <small className={classes.description}>
            Security profile will generate an audit for all instances
            associated, aggregated in the audit view to show pass/fail results
            and allow detailed inspection.
          </small>
        </p>
      </FlowCard>

      <div className={classes.line} />

      <div className={classes.smallCard}>End</div>
    </>,
  ];

  useEffect(() => {
    setSidePanelTitle(
      <>
        Add security profile{" "}
        <small className={classes.step}>
          Step {step + 1} of {steps.length}
        </small>
      </>,
    );
  }, [step]);

  return (
    <>
      {steps[step]}

      <SidePanelFormButtons
        hasBackButton={step > 0}
        onBackButtonPress={() => {
          setStep(step - 1);
        }}
        onSubmit={() => {
          if (step < steps.length - 1) {
            setStep(step + 1);
          } else {
            closeSidePanel();
            notify.success({
              title: `You have successfully created ${formik.values.name} security profile`,
              message: `This profile will perform an initial run${formik.values.mode != "auditOnly" ? ", apply remediation fixes on associated instances" : ""}${formik.values.mode == "fixRestartAudit" ? ", restart them," : ""} and generate an audit.`,
            });
          }
        }}
        submitButtonDisabled={false}
        submitButtonText={step < steps.length - 1 ? "Next" : "Add"}
      />
    </>
  );
};

export default SecurityProfileAddForm;
