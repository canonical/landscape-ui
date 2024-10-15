type Icon = { gray: string; color?: string } | { gray?: string; color: string };

export type Status = {
  icon: Icon;
  filterValue: string;
  alertType: string;
  label: string;
  query: string;
  alternateLabel?: string;
};
