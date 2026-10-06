import type { FC } from "react";
import { Link } from "react-router";
import EmptyState from "@/components/layout/EmptyState";
import useEnv from "@/hooks/useEnv";
import { ROUTES } from "@/libs/routes";

const EnvError: FC = () => {
  const { isSaas, isSelfHosted } = useEnv();

  return (
    <EmptyState
      title="Environment Error"
      body={
        <>
          {isSaas && "This feature is not available in SaaS mode."}
          {isSelfHosted && "This feature is not available in Self Hosted mode."}
        </>
      }
      cta={[
        <Link
          to={ROUTES.root.root()}
          replace
          className="p-button--positive u-no-margin--bottom"
          key="home-link"
        >
          Go back to the home page
        </Link>,
      ]}
      icon="warning-grey"
    />
  );
};

export default EnvError;
