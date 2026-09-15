import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AboutContainer } from "@/features/about";
import type { FC } from "react";

const AboutPage: FC = () => (
  <PageMain>
    <PageHeader title="About" />
    <PageContent container="medium" align="left">
      <AboutContainer />
    </PageContent>
  </PageMain>
);

export default AboutPage;
