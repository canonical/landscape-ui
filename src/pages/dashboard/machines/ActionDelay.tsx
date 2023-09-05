import { FC, useState } from "react";
import { CheckboxInput, Input } from "@canonical/react-components";

interface ActionDelayProps {
  setDeliverImmediately: (value: boolean) => void;
  setScheduleTime: (value: string) => void;
  description: string;
}

const ActionDelay: FC<ActionDelayProps> = ({
  setScheduleTime,
  setDeliverImmediately,
  description,
}) => {
  const [deliverNow, setDeliverNow] = useState(true);
  const [time, setTime] = useState("");

  return (
    <>
      <CheckboxInput
        label="Deliver as soon as possible"
        checked={deliverNow}
        onChange={() => {
          setDeliverImmediately(!deliverNow);
          setDeliverNow((prevState) => !prevState);
          setTime("");
          setScheduleTime("");
        }}
      />
      <Input
        type="datetime-local"
        label="Schedule time"
        labelClassName="u-off-screen"
        placeholder="Scheduled time"
        value={time}
        onChange={(event) => {
          setTime(event.target.value);
          setScheduleTime(event.target.value);
        }}
        disabled={deliverNow}
      />

      <p>{description}</p>
    </>
  );
};

export default ActionDelay;
