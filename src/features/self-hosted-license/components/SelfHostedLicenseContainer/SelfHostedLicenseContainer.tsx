import FormSection from "@/components/form/FormSection";
import useDebug from "@/hooks/useDebug";
import { useEffect, useEffectEvent, type FC } from "react";
import { useGetSelfHostedLicense } from "../../api/useGetSelfHostedLicense";
import CopyableCodeSnippet from "../CopyableCodeSnippet";
import DownloadLicenseButton from "../DownloadLicenseButton";
import RegenerateLicenseButton from "../RegenerateLicenseButton";
import classes from "./SelfHostedLicenseContainer.module.scss";

const SelfHostedLicenseContainer: FC = () => {
  const { downloadUrl, isGettingSelfHostedLicense, selfHostedLicenseError } =
    useGetSelfHostedLicense();
  const debug = useDebug();
  const showLicenseError = useEffectEvent((error: unknown) => {
    debug(error);
  });

  useEffect(() => {
    if (selfHostedLicenseError) {
      showLicenseError(selfHostedLicenseError);
    }
  }, [selfHostedLicenseError]);

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
        The download license button directs to a URL that contains a private
        token. If the token has been exposed, regenerate it. Regenerating the
        token invalidates the previous download URL.
      </p>

      <RegenerateLicenseButton disabled={!downloadUrl} />
    </FormSection>
  );
};

export default SelfHostedLicenseContainer;
