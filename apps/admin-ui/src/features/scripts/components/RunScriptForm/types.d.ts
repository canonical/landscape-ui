export interface FormProps {
  deliver_after: string;
  deliverImmediately: boolean;
  instanceIds: number[];
  queryType: "ids" | "tags";
  tags: string[];
  username: string;
  time_limit: number;
}
