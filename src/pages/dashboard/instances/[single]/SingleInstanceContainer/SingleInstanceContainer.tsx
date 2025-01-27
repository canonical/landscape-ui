import { FC, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
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
import {
  getBreadcrumbs,
  getInstanceRequestId,
  getInstanceTitle,
  getKernelCount,
  getPackageCount,
  getQueryComputerIdsParam,
  getQueryInstanceIdParam,
  getUsnCount,
  isInstanceFound,
  isInstancePackagesQueryEnabled,
  isInstanceQueryEnabled,
  isLivepatchInfoQueryEnabled,
  isUsnQueryEnabled,
} from "./helpers";
import { UrlParams } from "@/types/UrlParams";
import { useKernel } from "@/features/kernel";

const SingleInstanceContainer: FC = () => {
  const { instanceId, childInstanceId } = useParams<UrlParams>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getSingleInstanceQuery } = useInstances();
  const { getUsnsQuery } = useUsns();
  const { getInstancePackagesQuery } = usePackages();
  const { getLivepatchInfoQuery } = useKernel();

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
      instanceId: getInstanceRequestId(instanceId, childInstanceId),
      with_annotations: true,
      with_grouped_hardware: true,
    },
    {
      enabled: isInstanceQueryEnabled(
        instanceId,
        userAccountRef.current,
        user?.current_account,
      ),
    },
  );

  const instance = getSingleInstanceQueryResult?.data ?? null;

  const { data: getUsnsQueryResult, isLoading: getUsnsQueryLoading } =
    getUsnsQuery(
      {
        computer_ids: getQueryComputerIdsParam(instance),
        limit: 1,
      },
      {
        enabled: isUsnQueryEnabled(instance, instanceId, childInstanceId),
      },
    );

  const {
    data: getInstancePackagesQueryResult,
    isLoading: getInstancePackagesQueryLoading,
  } = getInstancePackagesQuery(
    {
      available: false,
      upgrade: true,
      instance_id: getQueryInstanceIdParam(instance),
      limit: 1,
    },
    {
      enabled: isInstancePackagesQueryEnabled(
        instance,
        instanceId,
        childInstanceId,
      ),
    },
  );

  const {
    data: getLivepatchInfoQueryResult,
    isLoading: getLivepatchInfoQueryResultLoading,
  } = getLivepatchInfoQuery(
    {
      id: getQueryInstanceIdParam(instance),
    },
    {
      enabled: isLivepatchInfoQueryEnabled(
        instance,
        instanceId,
        childInstanceId,
      ),
    },
  );

  const kernelTabFixes = getKernelCount(
    getLivepatchInfoQueryResult?.data.livepatch_info?.json?.output?.Status,
  );

  const isFound = isInstanceFound(instance, instanceId, childInstanceId);

  return (
    <PageMain>
      <PageHeader
        title={getInstanceTitle(instance)}
        hideTitle
        breadcrumbs={getBreadcrumbs(instance)}
      />
      <PageContent>
        {getSingleInstanceQueryLoading ? (
          <LoadingState />
        ) : (
          <>
            {!isFound && (
              <SingleInstanceEmptyState
                childInstanceId={childInstanceId}
                instanceId={instanceId}
              />
            )}
            {instance && isFound && (
              <SingleInstanceTabs
                instance={instance}
                packageCount={getPackageCount(
                  instance,
                  Number(getInstancePackagesQueryResult?.data.count),
                )}
                packagesLoading={getInstancePackagesQueryLoading}
                usnCount={getUsnCount(
                  instance,
                  Number(getUsnsQueryResult?.data.count),
                )}
                usnLoading={getUsnsQueryLoading}
                kernelCount={!instance.distribution ? 0 : kernelTabFixes}
                kernelLoading={getLivepatchInfoQueryResultLoading}
              />
            )}
          </>
        )}
      </PageContent>
    </PageMain>
  );
};

export default SingleInstanceContainer;
