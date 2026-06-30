import type { FC } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import { useAuthHandle } from "@/features/auth";

const REGISTER_PATH = "/how-to-register";

const InstanceEmptyState: FC = () => {
  const { getClassicDashboardUrlQuery } = useAuthHandle();
  const { data } = getClassicDashboardUrlQuery();
  const registerUrl = data?.data.url
    ? `${data.data.url}${REGISTER_PATH}`
    : undefined;


    return (
    <EmptyState
      title="No instances found"
      icon="connected"
      body="You don't have any instances registered to Landscape yet."
      link={{
        href: "https://ubuntu.com/landscape/docs/managing-computers",
        text: "How to manage instances in Landscape",
      }}
      cta={
        registerUrl
          ? [
              <Button
                appearance="positive"
                key="register-instance"
                onClick={() => {
                  window.location.assign(registerUrl);
                }}
                type="button"
              >
                Register instance
              </Button>,
            ]
          : []
      }
    />
  );
};

export default InstanceEmptyState;
