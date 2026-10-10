import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { SUPPORT_PROFILE_PAGES, SupportProfiles } from "@/features/super-admin";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";

const [FIRST_PROFILE_PAGE] = SUPPORT_PROFILE_PAGES;

const SupportProfilesPage: FC = () => {
  const { name = "", profileType = "" } = useParams<{
    name: string;
    profileType: string;
  }>();
  const { sidePath, name: selectedProfile, closeSidePanel } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["view"]);

  const page = SUPPORT_PROFILE_PAGES.find(({ slug }) => slug === profileType);

  // The type the selection in the URL was made for. A selection outlives a
  // change of type only through history or an edited address, and then
  // names a profile of the previous type.
  const [selectionType, setSelectionType] = useState(page?.type);
  const hasStaleSelection =
    !!page &&
    selectionType !== page.type &&
    (sidePath.length > 0 || !!selectedProfile);

  useEffect(() => {
    if (!page || selectionType === page.type) {
      return;
    }

    if (hasStaleSelection) {
      closeSidePanel();
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectionType(page.type);
  }, [page, selectionType, hasStaleSelection, closeSidePanel]);

  if (!page) {
    return (
      <Navigate
        to={ROUTES.superAdmin.sessionProfile(name, FIRST_PROFILE_PAGE.slug)}
        replace
      />
    );
  }

  if (hasStaleSelection) {
    return <LoadingState />;
  }

  return (
    <PageMain>
      <PageHeader title={page.label} />
      <PageContent hasTable>
        <SupportProfiles key={page.type} type={page.type} />
      </PageContent>
    </PageMain>
  );
};

export default SupportProfilesPage;
