import type { FC } from "react";
import { Link } from "react-router";
import EmptyState from "@/components/layout/EmptyState";
import { ROOT_PATH } from "@/constants";
import useEnv from "@/hooks/useEnv";

const EnvError: FC = () => {
  const { isSaas, isSelfHosted } = useEnv();

  return (
    <EmptyState
      title="Environment Error"
      body={
        <>
          <p>
            <span>
              {isSaas && "This feature is not available in SaaS mode."}
              {isSelfHosted &&
                "This feature is not available in Self Hosted mode."}
            </span>
          </p>
          <Link
            to={ROOT_PATH}
            replace
            className="p-button--positive u-no-margin--bottom"
          >
            Go back to the home page
          </Link>
        </>
      }
      icon="warning-grey"
    />
  );
};

export default EnvError;
