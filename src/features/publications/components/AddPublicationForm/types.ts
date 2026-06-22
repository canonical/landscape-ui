import type { PublishNewFormValues } from "../../types";

export interface FormProps extends PublishNewFormValues {
  sourceType: string;
  source: string;
  distribution: string;
  architectures: string[];
}

export interface SelectableSource {
  label: string;
  value: string;
  sourceType: string;
  distribution?: string;
  components: string[];
  architectures: string[];
  preserveSignatures?: boolean;
}
