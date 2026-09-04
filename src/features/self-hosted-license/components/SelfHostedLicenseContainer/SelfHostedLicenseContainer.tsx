import FormSection from "@/components/form/FormSection";
import { ROUTES } from "@/libs/routes";
import { CodeSnippet } from "@canonical/react-components";
import type { FC } from "react";
import { Link as RouterLink } from "react-router";
import { useGetSelfHostedLicense } from "../../api/useGetSelfHostedLicense";
import DownloadLicenseButton from "../DownloadLicenseButton";
import LicenseCurlCommand from "../LicenseCurlCommand";
import classes from "./SelfHostedLicenseContainer.module.scss";

const SelfHostedLicenseContainer: FC = () => {
  const { downloadUrl, isGettingSelfHostedLicense } = useGetSelfHostedLicense();

  return (
    <FormSection
      title="Setting up the license file"
      className={classes.formSection}
    >
      <p>
        In order to run Self-hosted Landscape, a license file needs to be
        present on the system where the software will be installed.
      </p>

      <p>
        Your license file contains information that uniquely indentifies your
        account and the number of seats you are entitled to, as well as the
        expiration date of your license.
      </p>

      <DownloadLicenseButton
        downloadUrl={downloadUrl}
        isLoading={isGettingSelfHostedLicense}
      />

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
        installed, you can perform the two steps above with a single command.
        Access is controlled by a private token which uniquely identifies
        download requests from your account:
      </p>

      <LicenseCurlCommand
        downloadUrl={downloadUrl}
        isLoading={isGettingSelfHostedLicense}
      />

      <p>
        If your credentials have been compromised, you can regenerate them on
        the{" "}
        <RouterLink to={ROUTES.account.apiCredentials()}>
          API credentials page.
        </RouterLink>
      </p>
    </FormSection>
  );
};

export default SelfHostedLicenseContainer;
