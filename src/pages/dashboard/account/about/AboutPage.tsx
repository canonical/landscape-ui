import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AboutContainer } from "@/features/about";
import type { FC } from "react";
import classes from "./AboutPage.module.scss";

const AboutPage: FC = () => (
  <div className={classes.aboutPage}>
    <PageMain>
      <PageHeader title="About" />
      <PageContent container="fluid">
        <AboutContainer />
      </PageContent>
    </PageMain>
  </div>
);

export default AboutPage;
