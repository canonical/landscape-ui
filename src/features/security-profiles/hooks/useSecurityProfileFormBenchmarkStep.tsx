import FileInput from "@/components/form/FileInput";
import LabelWithDescription from "@/components/layout/LabelWithDescription";
import { CustomSelect, Notification } from "@canonical/react-components";
import type { FormikContextType } from "formik";
import type { SecurityProfileAddFormValues } from "../types/SecurityProfileAddFormValues";

export default function useSecurityProfileFormBenchmarkStep<
  T extends SecurityProfileAddFormValues,
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
          disabled={disabled}
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
