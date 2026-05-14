import FileInput from "@/components/form/FileInput";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import LabelWithDescription from "@/components/layout/LabelWithDescription";
import { CustomSelect, Notification } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import {
  USG_PROFILE_BENCHMARK_LABELS,
  USG_PROFILE_MODE_LABELS,
} from "../constants";
import type { USGProfileFormValues } from "../types/USGProfileAddFormValues";

export default function useUsgProfileFormBenchmarkStep<
  T extends USGProfileFormValues,
>(formik: FormikContextType<T>, disabled?: boolean) {
  const handleFileUpload = async (files: File[]) => {
    await formik.setFieldValue("tailoring_file", files[0]);
  };

  const removeFile = async () => {
    await formik.setFieldValue("tailoring_file", null);
  };

  const getTailoringFileValue = () => {
    const file = formik.values.tailoring_file;
    if (!file) return "None";
    if (typeof file === "string") return file;
    return file.name;
  };

  return {
    isValid: !formik.errors.benchmark && !formik.errors.mode,
    isLoading: false,
    description:
      "Select a USG profile benchmark, choose the profile mode, and optionally upload a tailoring file to customize the USG profile.",
    content: disabled ? (
      <>
        <ReadOnlyField
          label="Base profile"
          value={
            USG_PROFILE_BENCHMARK_LABELS[
              formik.values
                .benchmark as keyof typeof USG_PROFILE_BENCHMARK_LABELS
            ] ?? formik.values.benchmark
          }
          tooltipMessage="You can't change the base profile after the USG profile has been created"
        />

        <ReadOnlyField
          label="Mode"
          value={
            USG_PROFILE_MODE_LABELS[
              formik.values.mode as keyof typeof USG_PROFILE_MODE_LABELS
            ] ?? formik.values.mode
          }
          tooltipMessage="You can't change the mode after the USG profile has been created"
        />

        <ReadOnlyField
          label="Tailoring file"
          value={getTailoringFileValue()}
          tooltipMessage="You can't change the tailoring file after the USG profile has been created"
        />
      </>
    ) : (
      <>
        <Notification severity="caution" title="Changes restricted:" inline>
          After profile creation, the USG profile benchmark and mode cannot be
          changed. Please review before proceeding.
        </Notification>

        <CustomSelect
          label="Base profile"
          options={[
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={USG_PROFILE_BENCHMARK_LABELS.cis_level1_workstation}
                  description="Center for Internet Security"
                  link="https://ubuntu.com/security/cis"
                />
              ),
              value: "cis_level1_workstation",
              text: USG_PROFILE_BENCHMARK_LABELS.cis_level1_workstation,
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={USG_PROFILE_BENCHMARK_LABELS.cis_level1_server}
                  description="Center for Internet Security"
                  link="https://ubuntu.com/security/cis"
                />
              ),
              value: "cis_level1_server",
              text: USG_PROFILE_BENCHMARK_LABELS.cis_level1_server,
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={USG_PROFILE_BENCHMARK_LABELS.cis_level2_workstation}
                  description="Center for Internet Security"
                  link="https://ubuntu.com/security/cis"
                />
              ),
              value: "cis_level2_workstation",
              text: USG_PROFILE_BENCHMARK_LABELS.cis_level2_workstation,
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={USG_PROFILE_BENCHMARK_LABELS.cis_level2_server}
                  description="Center for Internet Security"
                  link="https://ubuntu.com/security/cis"
                />
              ),
              value: "cis_level2_server",
              text: USG_PROFILE_BENCHMARK_LABELS.cis_level2_server,
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={USG_PROFILE_BENCHMARK_LABELS.disa_stig}
                  description="Defense Information System Agency (DISA) for the U.S. Department of Defense (DoD)"
                  link="https://ubuntu.com/security/disa-stig"
                />
              ),
              value: "disa_stig",
              text: USG_PROFILE_BENCHMARK_LABELS.disa_stig,
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
                  label={USG_PROFILE_MODE_LABELS["audit"]}
                  description="Generates an audit without applying any fixes or remediation."
                />
              ),
              value: "audit",
              text: USG_PROFILE_MODE_LABELS["audit"],
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={USG_PROFILE_MODE_LABELS["audit-fix"]}
                  description="Applies fixes and generates an audit after remediation."
                />
              ),
              value: "audit-fix",
              text: USG_PROFILE_MODE_LABELS["audit-fix"],
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={USG_PROFILE_MODE_LABELS["audit-fix-restart"]}
                  description="Applies fixes, requires a machine restart, and generates an
                  audit after remediation."
                />
              ),
              value: "audit-fix-restart",
              text: USG_PROFILE_MODE_LABELS["audit-fix-restart"],
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
              Customize your USG profile by adjusting or disabling rules to fit
              your system while staying compliant.
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
  };
}
