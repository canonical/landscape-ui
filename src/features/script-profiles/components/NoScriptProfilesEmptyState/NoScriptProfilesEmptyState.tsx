import EmptyState from "@/components/layout/EmptyState";
import type { FC } from "react";
import AddScriptProfileButton from "../AddScriptProfileButton";

const NoScriptProfilesEmptyState: FC = () => {
  return (
    <EmptyState
      title="You don't have any script profiles yet."
      body={
        <>
          <p>
            Script profiles allow you to automate your script runs based on
            triggers. Triggers can be either a recurring schedule, on a set
            date, or before or after an event.
          </p>

          <AddScriptProfileButton appearance="positive" />
        </>
      }
    />
  );
};

export default NoScriptProfilesEmptyState;
