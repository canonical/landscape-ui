export interface FormProps {
  deliverImmediately: boolean;
  deliver_after: string;
  instanceIds: number[];
  queryType: "ids" | "tags";
  tags: string[];
  username: string;
}
