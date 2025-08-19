export interface SelectOption {
  label: ReactNode;
  value: string;
  options?: Omit<SelectOption, "options">[];
}
