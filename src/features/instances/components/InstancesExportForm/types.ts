export type StepIndex = 0 | 1;

export interface ExportField {
  readonly id: string;
  readonly label: string;
  readonly defaultSelected?: boolean;
}

export interface ExportFieldGroup {
  readonly title: string;
  readonly key: string;
  readonly fields: readonly ExportField[];
}

export interface InstancesExportFormValues {
  readonly name: string;
  readonly selectedFieldIds: string[];
}