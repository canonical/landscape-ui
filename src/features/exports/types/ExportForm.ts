export interface ExportField {
  id: string;
  label: string;
}

export interface ExportFieldGroup {
  title: string;
  key: string;
  fields: readonly ExportField[];
}
