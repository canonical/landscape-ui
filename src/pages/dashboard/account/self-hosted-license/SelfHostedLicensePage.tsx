import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import FormSection from "@/components/form/FormSection";
import { Button, Link } from "@canonical/react-components";
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
      <PageContent container="medium" align="left">
        <hr className="p-rule" />
        <FormSection title="Setting up the license file">
          <p>
            In order to run Self-hosted Landscape, a license file needs to be
            present on the system where the software will be installed.
          </p>

          <p>
            Your license file contains information that uniquely indentifies
            your account and the number of seats you are entitled to, as well as
            the expiration date of your license.
          </p>

          <Button appearance="positive" hasIcon>
            <i className="p-icon--begin-downloading" />
            <span>Download license file</span>
          </Button>

          <p>
            Self-hosted Landscape expects to find your license file in the
            following location:
          </p>

          
        </FormSection>
      </PageContent>
    </PageMain>
  );
};

export default SelfHostedLicensePage;
