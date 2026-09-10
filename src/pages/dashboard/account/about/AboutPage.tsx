import FormSection from "@/components/form/FormSection";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { APP_COMMIT, APP_VERSION } from "@/constants";
import useEnv from "@/hooks/useEnv";
import type { FC } from "react";
import classes from "./AboutPage.module.scss";

const AboutPage: FC = () => {
  const { envLoading, packageVersion, revision } = useEnv();

  return (
    <PageMain>
      <PageHeader title="About" />
      <PageContent container="medium" align="left">
        {envLoading && <LoadingState />}
        {!envLoading && (
          <>
            <FormSection title="UI version">
              <InfoGrid className={classes.versionGrid} dense>
                <InfoGrid.Item
                  label="App version"
                  value={APP_VERSION || "unknown"}
                />
                <InfoGrid.Item
                  label="UI hash"
                  value={APP_COMMIT ? APP_COMMIT.slice(0, 7) : "unknown"}
                />
              </InfoGrid>
            </FormSection>
            <FormSection title="Server version">
              <InfoGrid className={classes.versionGrid} dense>
                <InfoGrid.Item
                  label="Package version"
                  value={packageVersion || "unknown"}
                />
                <InfoGrid.Item label="Revision" value={revision || "unknown"} />
              </InfoGrid>
            </FormSection>
          </>
        )}
      </PageContent>
    </PageMain>
  );
};

export default AboutPage;
