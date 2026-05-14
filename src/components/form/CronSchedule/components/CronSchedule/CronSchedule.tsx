import { Input } from "@canonical/react-components";
import { type ComponentProps, type FC } from "react";
import CronHelp from "../CronHelp";
import { toCronPhrase } from "./helpers";

type CronScheduleProps = ComponentProps<typeof Input> &
  Required<Pick<ComponentProps<typeof Input>, "value">> & {
    readonly touched?: boolean;
  };

const CronSchedule: FC<CronScheduleProps> = ({ touched, value, ...props }) => {
  let help = "";
  let errorMessage = "";

  try {
    const phrase = toCronPhrase(value.toString());
    help = `"${phrase.charAt(0).toUpperCase()}${phrase.slice(1)}"`;
  } catch (error) {
    if (!(error instanceof Error)) {
      return;
    }

    errorMessage = error.message;
  }

  return (
    <Input
      label={
        <>
          Schedule
          <CronHelp />
        </>
      }
      type="text"
      {...props}
      help={help}
      value={value}
      error={touched && errorMessage}
    />
  );
};

export default CronSchedule;
