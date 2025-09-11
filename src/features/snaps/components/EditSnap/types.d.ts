export interface SnapFormProps {
  deliver_immediately: boolean;
  randomize_delivery: boolean;
  release?: string;
  hold?: string;
  hold_until?: string;
  deliver_delay_window: number;
  deliver_after: string;
}

export type FormValidationSchemaShape = {
  [K in keyof SnapFormProps]?: Yup.AnySchema;
};
