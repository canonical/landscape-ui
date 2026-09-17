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
    <FormSection title="License file" className={classes.formSection}>
      <p className={classes.paragraph1}>
        Download the legacy <code>license.txt</code> file for this account.
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
      </p>

      <LicenseCurlCommand
        downloadUrl={downloadUrl}
        isLoading={isGettingSelfHostedLicense}
      />

      <p className={classes.paragraph4}>
        The license download URL contains a private token. If the token has been
        exposed, regenerate it. Regenerating the token invalidates the previous
        download URL.
      </p>

      <RegenerateLicenseButton />

      <p className={classes.paragraph5}>
        It&apos;s recommended that you protect this license file by making it readable
        only by the root and Landscape users:
      </p>

      <CopyableCodeSnippet
        value={`sudo chown root:landscape /etc/landscape/license.txt
sudo chmod 0640 /etc/landscape/license.txt`}
        wrapLines
      />
    </FormSection>
  );
};

export default SelfHostedLicenseContainer;
