import type { FC } from "react";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { getBreadcrumbs, isInstanceQueryEnabled } from "./helpers";
import { LoadingState, PageContent, PageHeader, PageMain } from "@landscape/ui";
import type { UrlParams } from "@landscape/types";
import { useAuth } from "@landscape/context";
import { useGetSingleInstanceQuery } from "./api";
import SingleInstanceEmptyState from "./SingleInstanceEmptyState";
import SingleInstanceTabs from "./SingleInstanceTabs";

const SingleInstanceContainer: FC = () => {
  const { instanceId } = useParams<UrlParams>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { instance, isInstanceLoading } = useGetSingleInstanceQuery(
    {
      instanceId: parseInt(instanceId || "0"),
      with_annotations: true,
      with_grouped_hardware: true,
    },
    {
      enabled: isInstanceQueryEnabled(
        instanceId,
        user?.current_account,
        user?.current_account,
      ),
    },
  );
  const userAccountRef = useRef("");

  useEffect(() => {
    if (!user?.current_account) {
      return;
    }

    if (!userAccountRef.current) {
      userAccountRef.current = user.current_account;
    }

    if (userAccountRef.current === user.current_account) {
      return;
    }

    navigate("/instances", { replace: true });
  }, [user?.current_account]);

  return (
    <PageMain>
      <PageHeader
        title={instance?.title ?? ""}
        hideTitle
        breadcrumbs={getBreadcrumbs(instance)}
      />
      <PageContent>
        {isInstanceLoading ? (
          <LoadingState />
        ) : (
          <>
            {!instance && <SingleInstanceEmptyState instanceId={instanceId} />}
            {instance && <SingleInstanceTabs instance={instance} />}
          </>
        )}
      </PageContent>
    </PageMain>
  );
};

export default SingleInstanceContainer;
