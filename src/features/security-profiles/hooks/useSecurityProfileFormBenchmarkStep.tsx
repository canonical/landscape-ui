import FileInput from "@/components/form/FileInput";
import LabelWithDescription from "@/components/layout/LabelWithDescription";
import { CustomSelect, Notification } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import {
  SECURITY_PROFILE_BENCHMARK_LABELS,
  SECURITY_PROFILE_MODE_LABELS,
} from "../constants";
import type { SecurityProfileFormValues } from "../types/SecurityProfileAddFormValues";

export default function useSecurityProfileFormBenchmarkStep<
  T extends SecurityProfileFormValues,
>(formik: FormikContextType<T>, disabled?: boolean) {
  const handleFileUpload = async (files: File[]) => {
    await formik.setFieldValue("tailoring_file", files[0]);
  };

  const removeFile = async () => {
    await formik.setFieldValue("tailoring_file", null);
  };

  return {
    isValid: !formik.errors.benchmark && !formik.errors.mode,
    description:
      "Select a security profile benchmark, choose the profile mode, and optionally upload a tailoring file to customize the security profile.",
    content: (
      <>
        {!disabled && (
          <Notification severity="caution" title="Changes restricted:" inline>
            After profile creation, the security profile benchmark and mode
            cannot be changed. Please review before proceeding.
          </Notification>
        )}

        <CustomSelect
          label="Base profile"
          disabled={disabled}
          options={[
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={
                    SECURITY_PROFILE_BENCHMARK_LABELS.cis_level1_workstation
                  }
                  description="Center for Internet Security"
                  link="https://ubuntu.com/security/cis"
                />
              ),
              value: "cis_level1_workstation",
              text: SECURITY_PROFILE_BENCHMARK_LABELS.cis_level1_workstation,
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={SECURITY_PROFILE_BENCHMARK_LABELS.cis_level1_server}
                  description="Center for Internet Security"
                  link="https://ubuntu.com/security/cis"
                />
              ),
              value: "cis_level1_server",
              text: SECURITY_PROFILE_BENCHMARK_LABELS.cis_level1_server,
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={
                    SECURITY_PROFILE_BENCHMARK_LABELS.cis_level2_workstation
                  }
                  description="Center for Internet Security"
                  link="https://ubuntu.com/security/cis"
                />
              ),
              value: "cis_level2_workstation",
              text: SECURITY_PROFILE_BENCHMARK_LABELS.cis_level2_workstation,
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={SECURITY_PROFILE_BENCHMARK_LABELS.cis_level2_server}
                  description="Center for Internet Security"
                  link="https://ubuntu.com/security/cis"
                />
              ),
              value: "cis_level2_server",
              text: SECURITY_PROFILE_BENCHMARK_LABELS.cis_level2_server,
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={SECURITY_PROFILE_BENCHMARK_LABELS.disa_stig}
                  description="Defense Information System Agency (DISA) for the U.S. Department of Defense (DoD)"
                  link="https://ubuntu.com/security/disa-stig"
                />
              ),
              value: "disa_stig",
              text: SECURITY_PROFILE_BENCHMARK_LABELS.disa_stig,
            },
          ]}
          value={formik.values.benchmark ?? ""}
          onChange={async (value) => formik.setFieldValue("benchmark", value)}
          required
          searchable="never"
        />

        <CustomSelect
          label="Mode"
          disabled={disabled}
          options={[
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={SECURITY_PROFILE_MODE_LABELS["audit"]}
                  description="Generates an audit without applying any fixes or remediation."
                />
              ),
              value: "audit",
              text: SECURITY_PROFILE_MODE_LABELS["audit"],
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={SECURITY_PROFILE_MODE_LABELS["audit-fix"]}
                  description="Applies fixes and generates an audit after remediation."
                />
              ),
              value: "audit-fix",
              text: SECURITY_PROFILE_MODE_LABELS["audit-fix"],
            },
            {
              label: (
                <LabelWithDescription
                  className="u-no-padding--top"
                  label={SECURITY_PROFILE_MODE_LABELS["audit-fix-restart"]}
                  description="Applies fixes, requires a machine restart, and generates an
                  audit after remediation."
                />
              ),
              value: "audit-fix-restart",
              text: SECURITY_PROFILE_MODE_LABELS["audit-fix-restart"],
            },
          ]}
          value={formik.values.mode ?? ""}
          onChange={async (value) => formik.setFieldValue("mode", value)}
          required
        />

        <FileInput
          label="Upload tailoring file"
          disabled={disabled}
          accept=".xml"
          {...formik.getFieldProps("tailoring_file")}
          help={
            <>
              Customize your security profile by adjusting or disabling rules to
              fit your system while staying compliant.
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
