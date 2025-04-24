export interface FormProps {
  access_group: string;
  deliver_after: string;
  deliverImmediately: boolean;
  instanceIds: number[];
  queryType: "ids" | "tags";
  tags: string[];
  username: string;
  time_limit: number;
}
