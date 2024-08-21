import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Icon } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { usePageParams } from "@/hooks/usePageParams";
import useUsns from "@/hooks/useUsns";

interface UsnPackagesRemoveButtonProps {
  instanceTitle: string;
  usn: string;
}

const UsnPackagesRemoveButton: FC<UsnPackagesRemoveButtonProps> = ({
  instanceTitle,
  usn,
}) => {
  const navigate = useNavigate();
  const debug = useDebug();
  const { notify } = useNotify();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { removeUsnPackagesQuery } = useUsns();
  const { setPageParams } = usePageParams();
  const { instanceId: urlInstanceId, childInstanceId } = useParams();

  const instanceId = Number(urlInstanceId);
  const { mutateAsync: removeUsnPackages } = removeUsnPackagesQuery;

  const handleActivityDetailsView = () => {
    navigate(
      `${ROOT_PATH}instances/${childInstanceId ? `${instanceId}/${childInstanceId}` : `${instanceId}`}`,
    );
    setPageParams({ tab: "activities" });
    notify.clear();
  };

  const handleRemoveUsnPackages = async () => {
    try {
      await removeUsnPackages({
        usns: usn,
        instanceId,
      });

      notify.success({
        title: "You queued packages to be uninstalled",
        message: `Packages affected by "${usn}" security issue will be uninstalled and are queued in Activities.`,
        actions: [
          {
            label: "View details",
            onClick: handleActivityDetailsView,
          },
        ],
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveUsnPackagesDialog = () => {
    confirmModal({
      title: "Uninstall USN packages",
      body: `This will uninstall packages affected by "${usn}" security issue from the "${instanceTitle}" instance.`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={handleRemoveUsnPackages}
        >
          Uninstall
        </Button>,
      ],
    });
  };

  return (
    <Button
      type="button"
      small
      dense
      hasIcon
      onClick={handleRemoveUsnPackagesDialog}
    >
      <Icon name="delete" className="u-no-margin--left" />
      <span>Uninstall packages</span>
    </Button>
  );
};

export default UsnPackagesRemoveButton;
