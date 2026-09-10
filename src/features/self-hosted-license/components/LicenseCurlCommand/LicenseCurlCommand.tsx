import LoadingState from "@/components/layout/LoadingState";
import { CodeSnippet } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import CopyableCodeSnippet from "../CopyableCodeSnippet";

interface LicenseCurlCommandProps {
  readonly downloadUrl?: string;
  readonly isLoading: boolean;
}

const LicenseCurlCommand: FC<LicenseCurlCommandProps> = ({
  downloadUrl,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <CodeSnippet blocks={[{ code: <LoadingState />, wrapLines: true }]} />
    );
  }

  if (!downloadUrl) {
    return (
      <CodeSnippet
        blocks={[
          {
            code: (
              <span className="u-text--negative">
                Unable to get the curl command to download the license file.
              </span>
            ),
            wrapLines: true,
          },
        ]}
      />
    );
  }

  const code = `sudo curl -so /etc/landscape/license.txt \\
${downloadUrl}`;

  return <CopyableCodeSnippet value={code} wrapLines />;
};

export default LicenseCurlCommand;
