import FormSection from "@/components/form/FormSection";
import type { FC } from "react";
import { useGetSelfHostedLicense } from "../../api/useGetSelfHostedLicense";
import CopyableCodeSnippet from "../CopyableCodeSnippet";
import DownloadLicenseButton from "../DownloadLicenseButton";
import LicenseCurlCommand from "../LicenseCurlCommand";
import RegenerateLicenseButton from "../RegenerateLicenseButton";
import classes from "./SelfHostedLicenseContainer.module.scss";

const SelfHostedLicenseContainer: FC = () => {
  const { downloadUrl, isGettingSelfHostedLicense } = useGetSelfHostedLicense();

  return (
    <FormSection
      title="Setting up the license file"
      className={classes.formSection}
    >
      <p className={classes.paragraph1}>
        In order to run Self-hosted Landscape, a license file needs to be
        present on the system where the software will be installed.
        <br />
        <br />
        Your license file contains information that uniquely indentifies your
        account and the number of seats you are entitled to, as well as the
        expiration date of your license.
      </p>

      <DownloadLicenseButton
        downloadUrl={downloadUrl}
        isLoading={isGettingSelfHostedLicense}
      />

      <p className={classes.paragraph2}>
        Self-hosted Landscape expects to find your license file in the following
        location:
      </p>

      <CopyableCodeSnippet value="/etc/landscape/license.txt" />

      <p className={classes.paragraph3}>
        If you have the <span className={classes.curl}>curl</span> package
        installed, you can perform the two steps above with a single command.
        Access is controlled by a private token which uniquely identifies
        download requests from your account:
      </p>

      <LicenseCurlCommand
        downloadUrl={downloadUrl}
        isLoading={isGettingSelfHostedLicense}
      />

      <p className={classes.paragraph4}>
        If your credentials have been compromised, you can regenerate them:
      </p>

      <RegenerateLicenseButton />
    </FormSection>
  );
};

export default SelfHostedLicenseContainer;
