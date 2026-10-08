import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { SUPPORT_PROFILE_PAGES, SupportProfiles } from "@/features/super-admin";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { Navigate, useParams } from "react-router";

const [FIRST_PROFILE_PAGE] = SUPPORT_PROFILE_PAGES;

const SupportProfilesPage: FC = () => {
  const { name = "", profileType = "" } = useParams<{
    name: string;
    profileType: string;
  }>();

  useSetDynamicFilterValidation("sidePath", ["view"]);

  const page = SUPPORT_PROFILE_PAGES.find(({ slug }) => slug === profileType);

  if (!page) {
    return (
      <Navigate
        to={ROUTES.superAdmin.sessionProfile(name, FIRST_PROFILE_PAGE.slug)}
        replace
      />
    );
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
