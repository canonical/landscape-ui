export interface FormProps {
  code: string;
  deliver_after: string;
  deliver_immediately: boolean;
  instanceIds: number[];
  queryType: "ids" | "tags";
  tags: string[];
  username: string;
  time_limit: number;
}
