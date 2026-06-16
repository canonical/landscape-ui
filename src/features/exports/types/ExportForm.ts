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
