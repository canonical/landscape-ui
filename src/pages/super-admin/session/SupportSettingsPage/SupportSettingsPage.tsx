import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  SUPPORT_SETTINGS_PAGES,
  SupportSettings,
  type SupportSettingsPage as SettingsPage,
} from "@/features/super-admin";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { Navigate, useParams } from "react-router";

const [FIRST_SETTINGS_PAGE] = SUPPORT_SETTINGS_PAGES as [SettingsPage];

const SupportSettingsPage: FC = () => {
  const { name = "", setting = "" } = useParams<{
    name: string;
    setting: string;
  }>();

  const page = SUPPORT_SETTINGS_PAGES.find(({ slug }) => slug === setting);

  if (!page) {
    return (
      <Navigate
        to={ROUTES.superAdmin.sessionSetting(name, FIRST_SETTINGS_PAGE.slug)}
        replace
      />
    );
  }

  return (
    <PageMain>
      <PageHeader title={page.label} />
      <PageContent hasTable={page.slug !== "general"}>
        <SupportSettings key={page.slug} setting={page.slug} />
      </PageContent>
    </PageMain>
  );
};

export default SupportSettingsPage;
