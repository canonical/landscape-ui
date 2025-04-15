import { Input } from "@canonical/react-components";
import { useId, type ComponentProps, type FC } from "react";
import CronHelp from "../CronHelp";
import { getCronPhrase } from "./helpers";

type CronScheduleProps = ComponentProps<typeof Input> &
  Required<Pick<ComponentProps<typeof Input>, "value">> & {
    touched?: boolean;
  };

const CronSchedule: FC<CronScheduleProps> = ({ touched, value, ...props }) => {
  const id = useId();

  try {
    const phrase = getCronPhrase(value.toString());
    const help = `"${phrase.charAt(0).toUpperCase()}${phrase.slice(1)}"`;

    return (
      <>
        <label htmlFor={id}>* Schedule</label>
        <CronHelp />

        <Input
          id={id}
          type="text"
          {...props}
          help={help}
          value={value}
          required
        />
      </>
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
        error={touched && error.message}
        value={value}
      />
    );
  }
};

export default CronSchedule;
