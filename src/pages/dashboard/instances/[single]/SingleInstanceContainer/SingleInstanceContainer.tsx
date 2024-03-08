import { FC, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useInstances from "@/hooks/useInstances";
import PageMain from "@/components/layout/PageMain";
import PageContent from "@/components/layout/PageContent";
import { Button } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/layout/EmptyState";
import { ROOT_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";
import SingleInstanceTabs from "@/pages/dashboard/instances/[single]/SingleInstanceTabs";
import { getBreadcrumbs } from "./helpers";

const SingleInstanceContainer: FC = () => {
  const { hostname, childHostname } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const debug = useDebug();

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

  const { getInstancesQuery } = useInstances();

  const { data: getInstancesQueryResult, error: getInstancesQueryError } =
    getInstancesQuery({
      query: `hostname:${hostname}`,
      with_annotations: true,
    });

  if (getInstancesQueryError) {
    debug(getInstancesQueryError);
  }

  const instance = getInstancesQueryResult?.data.results[0] ?? null;

  return (
    <PageMain>
      <PageHeader
        title={instance?.title ?? childHostname ?? hostname ?? ""}
        hideTitle
        breadcrumbs={getBreadcrumbs(instance, hostname, childHostname)}
      />
      <PageContent>
        {!instance && getInstancesQueryResult && (
          <EmptyState
            title="Instance not found"
            icon="connected"
            body={
              <p className="u-no-margin--bottom">
                Seems like the instance <code>{hostname}</code> doesn&apos;t
                exist
              </p>
            }
            cta={[
              <Button
                appearance="positive"
                key="go-back-to-instances-page"
                onClick={() =>
                  navigate(`${ROOT_PATH}instances`, { replace: true })
                }
                type="button"
                aria-label="Go back"
              >
                Back to Instances page
              </Button>,
              <Button
                key="go-back-to-home-page"
                onClick={() => navigate(`${ROOT_PATH}`, { replace: true })}
                type="button"
                aria-label="Go back"
              >
                Home page
              </Button>,
            ]}
          />
        )}
        {instance && <SingleInstanceTabs instance={instance} />}
      </PageContent>
    </PageMain>
  );
};

export default SingleInstanceContainer;
