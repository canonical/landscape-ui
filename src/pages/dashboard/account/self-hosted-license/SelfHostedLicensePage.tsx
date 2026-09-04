import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { SelfHostedLicenseContainer } from "@/features/self-hosted-license";
import { Link } from "@canonical/react-components";
import type { FC } from "react";
import { SELF_HOSTED_LANDSCAPE_DOCUMENTATION_URL } from "./constants";
import classes from "./SelfHostedLicensePage.module.scss";

const SelfHostedLicensePage: FC = () => {
  return (
    <PageMain>
      <PageHeader
        title="Self hosted license"
        className={classes.header}
        helperContent={
          <p className={`${classes.description} p-text--small u-text--muted`}>
            Self-hosted Landscape is the standalone version of Landscape that
            you can install on-premises or in a public cloud.{" "}
            <Link
              href={SELF_HOSTED_LANDSCAPE_DOCUMENTATION_URL}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Learn more about self hosted landscape
            </Link>
          </p>
        }
      />
      <PageContent>
        <hr className={`p-rule ${classes.rule}`} />
        <div className={classes.content}>
          <SelfHostedLicenseContainer />
        </div>
      </PageContent>
    </PageMain>
  );
};

export default SelfHostedLicensePage;
