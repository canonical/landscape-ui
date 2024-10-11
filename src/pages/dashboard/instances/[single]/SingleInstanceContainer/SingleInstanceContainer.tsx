import { FC, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { ROOT_PATH } from "@/constants";
import { usePackages } from "@/features/packages";
import useAuth from "@/hooks/useAuth";
import useInstances from "@/hooks/useInstances";
import { useUsns } from "@/features/usns";
import SingleInstanceEmptyState from "@/pages/dashboard/instances/[single]/SingleInstanceEmptyState";
import SingleInstanceTabs from "@/pages/dashboard/instances/[single]/SingleInstanceTabs";
import { getBreadcrumbs } from "./helpers";
import { UrlParams } from "@/types/UrlParams";

const SingleInstanceContainer: FC = () => {
  const { instanceId, childInstanceId } = useParams<UrlParams>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getSingleInstanceQuery } = useInstances();
  const { getUsnsQuery } = useUsns();
  const { getInstancePackagesQuery } = usePackages();

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

    navigate(`${ROOT_PATH}instances`, { replace: true });
  }, [user?.current_account]);

  const {
    data: getSingleInstanceQueryResult,
    isLoading: getSingleInstanceQueryLoading,
  } = getSingleInstanceQuery(
    {
      instanceId: childInstanceId
        ? parseInt(childInstanceId)
        : parseInt(instanceId ?? ""),
      with_annotations: true,
      with_grouped_hardware: true,
    },
    {
      enabled:
        !!instanceId &&
        (!userAccountRef.current ||
          userAccountRef.current === user?.current_account),
    },
  );

  const instance = getSingleInstanceQueryResult?.data ?? null;

  const { data: getUsnsQueryResult, isLoading: getUsnsQueryLoading } =
    getUsnsQuery(
      {
        computer_ids: instance ? [instance.id] : [],
        limit: 1,
      },
      {
        enabled:
          !!instance?.distribution &&
          /\d{1,2}\.\d{2}/.test(instance.distribution) &&
          (!childInstanceId ||
            instance.parent?.id === parseInt(instanceId ?? "")),
      },
    );

  const {
    data: getInstancePackagesQueryResult,
    isLoading: getInstancePackagesQueryLoading,
  } = getInstancePackagesQuery(
    {
      available: false,
      upgrade: true,
      instance_id: instance ? instance.id : 0,
      limit: 1,
    },
    {
      enabled:
        !!instance?.distribution &&
        /\d{1,2}\.\d{2}/.test(instance.distribution) &&
        (!childInstanceId ||
          instance.parent?.id === parseInt(instanceId ?? "")),
    },
  );

  return (
    <PageMain>
      <PageHeader
        title={instance?.title ?? ""}
        hideTitle
        breadcrumbs={getBreadcrumbs(instance)}
      />
      <PageContent>
        {getSingleInstanceQueryLoading && <LoadingState />}
        {!getSingleInstanceQueryLoading &&
          (!instance ||
            (childInstanceId &&
              instance?.parent?.id !== parseInt(instanceId ?? ""))) && (
            <SingleInstanceEmptyState
              childInstanceId={childInstanceId}
              instanceId={instanceId}
            />
          )}
        {!getSingleInstanceQueryLoading &&
          instance &&
          (!childInstanceId ||
            (instance.parent &&
              instance.parent.id === parseInt(instanceId ?? ""))) && (
            <SingleInstanceTabs
              instance={instance}
              packageCount={
                !instance.distribution
                  ? 0
                  : getInstancePackagesQueryResult?.data.count
              }
              packagesLoading={getInstancePackagesQueryLoading}
              usnCount={
                !instance.distribution ? 0 : getUsnsQueryResult?.data.count
              }
              usnLoading={getUsnsQueryLoading}
            />
          )}
      </PageContent>
    </PageMain>
  );
};

export default SingleInstanceContainer;
