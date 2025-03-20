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
import { INPUT_DATE_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  CustomSelect,
  Input,
  Notification,
  Row,
} from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import type { SecurityProfileAddFormValues } from "../../types/SecurityProfileAddFormValues";
import classes from "./SecurityProfileAddForm.module.scss";

const SecurityProfileAddForm = () => {
  const currentDate = moment().format(`${INPUT_DATE_FORMAT}THH:mm`);

  const formik = useFormik<SecurityProfileAddFormValues>({
    initialValues: {
      all_computers: false,
      access_group: "",
      base_profile: "",
      cron_schedule: "",
      delivery_time: "asap",
      end_date: "",
      end_type: "never",
      every: 7,
      is_cron: false,
      mode: "",
      name: "",
      on: [],
      randomize_delivery: "no",
      schedule: "",
      start_date: currentDate,
      start_type: "",
      tags: [],
      unit_of_time: "days",
    },
    validationSchema: Yup.object().shape({
      all_computers: Yup.boolean(),
      access_group: Yup.string().required("This field is required"),
      base_profile: Yup.string().required("This field is required"),
      cron_schedule: Yup.string().required("This field is required"),
      delivery_time: Yup.string(),
      end_date: Yup.string(),
      end_type: Yup.string(),
      every: Yup.number(),
      is_cron: Yup.boolean(),
      mode: Yup.string().required("This field is required"),
      name: Yup.string().required("This field is required"),
      on: Yup.array().of(Yup.string()),
      randomize_delivery: Yup.string(),
      schedule: Yup.string(),
      start_date: Yup.string(),
      start_type: Yup.string(),
      tags: Yup.array().of(Yup.string()),
      unit_of_time: Yup.string(),
    }),
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
        error={getFormikError(formik, "name")}
        required
      />

      <AccessGroupSelect formik={formik} />
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
              <LabelWithDescription
                label="CIS"
                description="Center for Internet Security"
                link="https://ubuntu.com/security/cis"
              />
            ),
            value: "cis",
            text: "CIS",
          },
          {
            label: (
              <LabelWithDescription
                label="DISA-STIG"
                description="Defense Information System Agency (DISA) for the U.S. Department of Defense (DoD)"
                link="https://ubuntu.com/security/disa-stig"
              />
            ),
            value: "disa-stig",
            text: "DISA-STIG",
          },
        ]}
        value={formik.values.base_profile}
        onChange={async (value) => formik.setFieldValue("base_profile", value)}
        required
      />

      <CustomSelect
        label="Mode"
        options={[
          {
            label: (
              <LabelWithDescription
                label="Audit only"
                description="Generates an audit without applying any fixes or remediation."
              />
            ),
            value: "audit-only",
            text: "Audit only",
          },
          {
            label: (
              <LabelWithDescription
                label="Fix and audit"
                description="Applies fixes and generates an audit after remediation."
              />
            ),
            value: "fix-and-audit",
            text: "Fix and audit",
          },
          {
            label: (
              <LabelWithDescription
                label="Fix, restart, audit"
                description="Applies fixes, requires a machine restart, and generates an
                  audit after remediation."
              />
            ),
            value: "fix-restart-audit",
            text: "Fix, restart, audit",
          },
        ]}
        value={formik.values.mode}
        onChange={async (value) => formik.setFieldValue("mode", value)}
        required
      />

      <FileInput
        label="Upload tailoring file"
        accept=".xml"
        {...formik.getFieldProps("tailoring_file")}
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
        {formik.values.mode != "audit-only" && "apply fixes"}
        {formik.values.mode == "fix-restart-audit" && ", restart instances,"}
        {formik.values.mode != "audit-only" && " and "}
        generate an audit - on the selected next run date.
      </p>

      <Flow
        cards={[
          {
            header: "Next run date",
            description: (
              <>
                Security profile&apos;s next run date arrives
                <br />
                12 Mar 2025, 12:00
              </>
            ),
            iconName: "revisions",
          },
          {
            header: "Apply fixes",
            description:
              "Security profile will attempt to apply remediations before the next audit, helping maintain instances' compliance with the security profile.",
            iconName: "open-terminal",
            condition: formik.values.mode != "audit-only",
          },
          {
            header: "Restart instances",
            description: "To complete the fixes, instances must be restarted.",
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
                    value={formik.values.randomize_delivery ? "Yes" : "No"}
                  />
                </Row>
              </>
            ),
            condition: formik.values.mode == "fix-restart-audit",
          },
          {
            header: "Generate an audit",
            description:
              "Security profile will generate an audit for all instances associated, aggregated in the audit view to show pass/fail results and allow detailed inspection.",
            iconName: "revisions",
          },
        ]}
      />
    </>,
  ];

  const isValid = [
    !formik.errors.name && formik.touched.name && !formik.errors.access_group,
    !formik.errors.base_profile && !formik.errors.mode,
    !formik.errors.start_type,
    true,
    true,
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
              message: `This profile will perform an initial run${formik.values.mode != "audit-only" ? ", apply remediation fixes on associated instances" : ""}${formik.values.mode == "fix-restart-audit" ? ", restart them," : ""} and generate an audit.`,
            });
          }
        }}
        submitButtonDisabled={!isValid[step]}
        submitButtonText={step < steps.length - 1 ? "Next" : "Add"}
      />
    </>
  );
};

export default SecurityProfileAddForm;
