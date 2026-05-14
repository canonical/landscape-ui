export interface FormikProps {
  readonly contents: string;
  readonly filename: string;
  readonly is_default: boolean;
}

export interface AutoinstallOverrideWarning {
  error: "AutoinstallOverrideWarning";
  message: string;
}
