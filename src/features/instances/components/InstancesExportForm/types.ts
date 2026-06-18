export type { ExportField, ExportFieldGroup } from "@/features/exports";

export type StepIndex = 0 | 1;

export interface InstancesExportFormValues {
  name: string;
  selectedFieldIds: string[];
  retainUntil: string;
}
