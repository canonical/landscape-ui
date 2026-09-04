import LoadingState from "@/components/layout/LoadingState";
import { CodeSnippet } from "@canonical/react-components";
import type { FC } from "react";

interface LicenseCurlCommandProps {
  readonly downloadUrl?: string;
  readonly isLoading: boolean;
}

const LicenseCurlCommand: FC<LicenseCurlCommandProps> = ({
  downloadUrl,
  isLoading,
}) => {
  const code =
    !isLoading && downloadUrl ? (
      `sudo curl -so /etc/landscape/license.txt \\
${downloadUrl}`
    ) : (
      <LoadingState />
    );

  return <CodeSnippet blocks={[{ code, wrapLines: true }]} />;
};

export default LicenseCurlCommand;
