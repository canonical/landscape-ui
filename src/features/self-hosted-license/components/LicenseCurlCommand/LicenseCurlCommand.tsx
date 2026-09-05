import LoadingState from "@/components/layout/LoadingState";
import { CodeSnippet } from "@canonical/react-components";
import type { FC, ReactNode } from "react";

interface LicenseCurlCommandProps {
  readonly downloadUrl?: string;
  readonly isLoading: boolean;
}

const LicenseCurlCommand: FC<LicenseCurlCommandProps> = ({
  downloadUrl,
  isLoading,
}) => {
  let code: ReactNode;

  if (isLoading) {
    code = <LoadingState />;
  } else if (!downloadUrl) {
    code = (
      <span className="u-text--negative">
        Unable to get the download license curl command.
      </span>
    );
  } else {
    code = `sudo curl -so /etc/landscape/license.txt \\
${downloadUrl}`;
  }

  return <CodeSnippet blocks={[{ code, wrapLines: true }]} />;
};

export default LicenseCurlCommand;
