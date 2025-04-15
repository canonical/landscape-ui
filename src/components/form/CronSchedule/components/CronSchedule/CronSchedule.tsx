import { Input } from "@canonical/react-components";
import { useId, type ComponentProps, type FC } from "react";
import CronHelp from "../CronHelp";
import { getCronPhrase } from "./helpers";

type CronScheduleProps = ComponentProps<typeof Input> &
  Required<Pick<ComponentProps<typeof Input>, "value">> & {
    readonly touched?: boolean;
  };

const CronSchedule: FC<CronScheduleProps> = ({ touched, value, ...props }) => {
  const id = useId();

  let help = "";
  let errorMessage = "";

  try {
    const phrase = getCronPhrase(value.toString());
    help = `"${phrase.charAt(0).toUpperCase()}${phrase.slice(1)}"`;
  } catch (error) {
    if (!(error instanceof Error)) {
      return;
    }

    errorMessage = error.message;
  }

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
        error={touched && errorMessage}
        required
      />
    </>
  );
};

export default CronSchedule;
