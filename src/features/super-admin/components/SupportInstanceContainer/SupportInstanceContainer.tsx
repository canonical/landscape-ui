import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import StaticLink from "@/components/layout/StaticLink";
import usePageParams from "@/hooks/usePageParams";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { useGetStaffInstance } from "../../api";
import SupportInstanceTabs, {
  isSupportInstanceTableTab,
} from "../SupportInstanceTabs";
import {
  getBreadcrumbs,
  getRequestedInstanceId,
  isInstanceFound,
} from "./helpers";

const NOT_FOUND_STATUS = 404;

interface SupportInstanceContainerProps {
  /** The account the instance belongs to. */
  readonly name: string;
  readonly instanceId: string | undefined;
  /** Set when the page shows a WSL child of the instance `instanceId`. */
  readonly childInstanceId: string | undefined;
}

/** The read-only page of one instance of the account named `name`. */
const SupportInstanceContainer: FC<SupportInstanceContainerProps> = ({
  name,
  instanceId,
  childInstanceId,
}) => {
  const { tab } = usePageParams();

  const requestedId = getRequestedInstanceId(instanceId, childInstanceId);
  const hasValidId = Number.isInteger(requestedId);

  const { staffInstance, staffInstanceError, isGettingStaffInstance } =
    useGetStaffInstance(name, {
      instanceId: requestedId,
      with_annotations: true,
      with_grouped_hardware: true,
      with_profiles: true,
      with_alerts: true,
    });

  const isNotFound = staffInstanceError?.response?.status === NOT_FOUND_STATUS;

  if (staffInstanceError && !isNotFound) {
    throw staffInstanceError;
  }

  const isFound = isInstanceFound(staffInstance, instanceId, childInstanceId);
  const instance = isFound ? staffInstance : undefined;

  return (
    <>
      <PageHeader
        title={instance?.title ?? ""}
        hideTitle
        breadcrumbs={getBreadcrumbs(name, instance)}
      />
      <PageContent hasTable={isSupportInstanceTableTab(tab)}>
        {hasValidId && isGettingStaffInstance && <LoadingState />}
        {instance && <SupportInstanceTabs name={name} instance={instance} />}
        {!instance && !(hasValidId && isGettingStaffInstance) && (
          <EmptyState
            title="Instance not found"
            icon="connected"
            body="This account has no instance at this address."
            cta={[
              <StaticLink
                key="instances"
                to={ROUTES.superAdmin.sessionInstances(name)}
              >
                Back to instances
              </StaticLink>,
            ]}
          />
        )}
      </PageContent>
    </>
  );
};

export default SupportInstanceContainer;
