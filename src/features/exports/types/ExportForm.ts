export interface ExportField {
  id: string;
  label: string;
}

export interface ExportFieldGroup {
  title: string;
  key: string;
  fields: readonly ExportField[];
}

export type StepIndex = 0 | 1;

export interface ExportFormValues {
  name: string;
  selectedFieldIds: string[];
  retainUntil: string;
}
