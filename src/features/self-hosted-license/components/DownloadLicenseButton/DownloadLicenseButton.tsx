import { Button } from "@canonical/react-components";
import type { FC } from "react";

interface DownloadLicenseButtonProps {
  readonly downloadUrl?: string;
  readonly isLoading: boolean;
}

const DownloadLicenseButton: FC<DownloadLicenseButtonProps> = ({
  downloadUrl,
  isLoading,
}) => {
  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Button
      appearance="positive"
      disabled={isLoading || !downloadUrl}
      hasIcon
      onClick={handleDownload}
      type="button"
    >
      <i className="p-icon--begin-downloading" />
      <span>Download license file</span>
    </Button>
  );
};

export default DownloadLicenseButton;
