import { Input } from "@canonical/react-components";
import type { ComponentProps, FC } from "react";
import CronHelp from "../CronHelp";
import { getCronPhrase } from "./helpers";

type CronScheduleProps = ComponentProps<typeof Input> &
  Required<Pick<ComponentProps<typeof Input>, "value">>;

const CronSchedule: FC<CronScheduleProps> = ({ value, ...props }) => {
  try {
    const phrase = getCronPhrase(value.toString());

    return (
      <Input
        type="text"
        label={
          <>
            Schedule
            <CronHelp />
          </>
        }
        {...props}
        help={phrase}
        value={value}
      />
    );
  } catch (error) {
    if (!(error instanceof Error)) {
      return;
    }

    return (
      <Input
        type="text"
        label={
          <>
            Schedule
            <CronHelp />
          </>
        }
        {...props}
        error={error.message}
        value={value}
      />
    );
  }
};

export default CronSchedule;
