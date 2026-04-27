import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import {
  RepositoryProfileAddButton,
  RepositoryProfileContainer,
  useRepositoryProfiles,
} from "@/features/repository-profiles";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import { lazy, type FC } from "react";

const RepositoryProfileDetails = lazy(async () =>
  import("@/features/repository-profiles").then((module) => ({
    default: module.RepositoryProfileDetails,
  })),
);

const RepositoryProfileEditForm = lazy(async () =>
  import("@/features/repository-profiles").then((module) => ({
    default: module.RepositoryProfileEditForm,
  })),
);

const RepositoryProfilesPage: FC = () => {
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

  useSetDynamicFilterValidation("sidePath", ["view", "edit"]);

  const unfilteredRepositoryProfilesResult = getRepositoryProfilesQuery({
    limit: 0,
  });

  if (unfilteredRepositoryProfilesResult.isPending) {
    return <LoadingState />;
  }

  return (
    <PageMain>
      <PageHeader
        title="Repository profiles"
        actions={
          unfilteredRepositoryProfilesResult.data?.data.count
            ? [<RepositoryProfileAddButton key="add" />]
            : undefined
        }
      />
      <PageContent hasTable>
        <RepositoryProfileContainer
          unfilteredRepositoryProfilesResult={
            unfilteredRepositoryProfilesResult
          }
        />
      </PageContent>
      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], name: "" })}
        isOpen={!!sidePath.length}
      >
        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <RepositoryProfileDetails />
          </SidePanel.Suspense>
        )}
        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <RepositoryProfileEditForm />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RepositoryProfilesPage;
