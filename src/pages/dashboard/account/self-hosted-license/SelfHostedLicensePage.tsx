import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import FormSection from "@/components/form/FormSection";
import { ROUTES } from "@/libs/routes";
import { Button, CodeSnippet, Link } from "@canonical/react-components";
import type { FC } from "react";
import { Link as RouterLink } from "react-router";
import { redirectToExternalUrl } from "@/features/auth/helpers";
import { SELF_HOSTED_LANDSCAPE_DOCUMENTATION_URL } from "./constants";
import { useGetSelfHostedLicense } from "./api/useGetSelfHostedLicense";
import classes from "./SelfHostedLicensePage.module.scss";

const SelfHostedLicensePage: FC = () => {
  const { downloadUrl, isGettingSelfHostedLicense } =
    useGetSelfHostedLicense();

  const curlCommand = !isGettingSelfHostedLicense && downloadUrl
    ? `sudo curl -so /etc/landscape/license.txt \\
${downloadUrl}`
    : "Loading...";

  const handleDownload = () => {
    if (downloadUrl) {
      redirectToExternalUrl(downloadUrl);
    }
  };

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
        <hr className="p-rule" />
        <div className={classes.content}>
          <FormSection title="Setting up the license file">
            <p>
              In order to run Self-hosted Landscape, a license file needs to be
              present on the system where the software will be installed.
            </p>

            <p>
              Your license file contains information that uniquely indentifies
              your account and the number of seats you are entitled to, as well
              as the expiration date of your license.
            </p>

            <Button
              appearance="positive"
              disabled={isGettingSelfHostedLicense || !downloadUrl}
              hasIcon
              onClick={handleDownload}
              type="button"
            >
              <i className="p-icon--begin-downloading" />
              <span>Download license file</span>
            </Button>

            <p>
              Self-hosted Landscape expects to find your license file in the
              following location:
            </p>

            <CodeSnippet
              blocks={[
                {
                  code: "/etc/landscape/license.txt",
                },
              ]}
            />

            <p>
              If you have the <span className={classes.curl}>curl</span> package
              installed, you can perform the two steps above with a single
              command. Access is controlled by a private token which uniquely
              identifies download requests from your account:
            </p>

            <CodeSnippet
              blocks={[
                {
                  code: curlCommand,
                  wrapLines: true,
                },
              ]}
            />

            <p>
              If your credentials have been compromised, you can regenerate them
              on the{" "}
              <RouterLink to={ROUTES.account.apiCredentials()}>
                API credentials page.
              </RouterLink>
            </p>
          </FormSection>
        </div>
      </PageContent>
    </PageMain>
  );
};

export default SelfHostedLicensePage;
