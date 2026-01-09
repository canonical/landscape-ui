interface Icon {
  gray: string | undefined;
  color: string;
}

export interface Status {
  icon: Icon;
  filterValue: string;
  alertType: string;
  label: string;
  query: string;
  alternateLabel: string | undefined;
}
