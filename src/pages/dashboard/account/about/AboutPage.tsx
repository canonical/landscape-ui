import FormSection from "@/components/form/FormSection";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { APP_COMMIT, APP_VERSION } from "@/constants";
import useEnv from "@/hooks/useEnv";
import type { FC } from "react";

const AboutPage: FC = () => {
  const { envLoading, packageVersion, revision } = useEnv();

  return (
    <PageMain>
      <PageHeader title="About" />
      <PageContent container="medium" align="left">
        <FormSection title="Version">
          {envLoading && <LoadingState />}
          {!envLoading && (
            <InfoGrid>
              <InfoGrid.Item
                label="UI version"
                value={`${APP_VERSION || "unknown"} (${APP_COMMIT ? APP_COMMIT.slice(0, 7) : "unknown"})`}
              />
              <InfoGrid.Item
                label="Server version"
                value={`${packageVersion || "unknown"} (${revision || "unknown"})`}
              />
            </InfoGrid>
          )}
        </FormSection>
      </PageContent>
    </PageMain>
  );
};

export default AboutPage;
