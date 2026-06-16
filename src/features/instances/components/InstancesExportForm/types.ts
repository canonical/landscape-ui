export type { ExportField, ExportFieldGroup } from "@/features/exports";

export type StepIndex = 0 | 1;

export interface InstancesExportFormValues {
  readonly name: string;
  readonly selectedFieldIds: string[];
  readonly retainUntil: string;
}
