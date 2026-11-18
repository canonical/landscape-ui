import FormSection from "@/components/form/FormSection";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useGetSelfHostedLicense } from "../../api/useGetSelfHostedLicense";
import CopyableCodeSnippet from "../CopyableCodeSnippet";
import DownloadLicenseButton from "../DownloadLicenseButton";
import LicenseCurlCommand from "../LicenseCurlCommand";
import RegenerateLicenseButton from "../RegenerateLicenseButton";
import classes from "./SelfHostedLicenseContainer.module.scss";

const SelfHostedLicenseContainer: FC = () => {
  const {
    downloadUrl,
    hasSelfHostedLicenseError,
    isGettingSelfHostedLicense,
    isFetchingSelfHostedLicense,
    refetchSelfHostedLicense,
  } = useGetSelfHostedLicense();

  if (hasSelfHostedLicenseError) {
    return (
      <EmptyState
        title="Could not load the legacy license file"
        icon="connected"
        cta={[
          <Button
            key="retry"
            type="button"
            appearance="positive"
            disabled={isFetchingSelfHostedLicense}
            onClick={() => {
              void refetchSelfHostedLicense();
            }}
          >
            Try again
          </Button>,
        ]}
      />
    );
  }

  if (isGettingSelfHostedLicense) {
    return <LoadingState />;
  }

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
        You can also perform the two steps above with a single command. Note
        that you&apos;ll need <span className={classes.curl}>curl</span>{" "}
        installed on the instance:
      </p>

      <LicenseCurlCommand
        downloadUrl={downloadUrl}
        isLoading={isGettingSelfHostedLicense}
      />

      <p className={classes.paragraph4}>
        The download license button and curl command utilize a download URL that
        contains a private token. If the token has been exposed, regenerate it.
        Regenerating the token invalidates the previous download URL.
      </p>

      <RegenerateLicenseButton disabled={!downloadUrl} />
    </FormSection>
  );
};

export default SelfHostedLicenseContainer;
