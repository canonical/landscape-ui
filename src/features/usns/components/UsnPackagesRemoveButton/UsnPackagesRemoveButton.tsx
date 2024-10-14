import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmationButton, Icon } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { usePageParams } from "@/hooks/usePageParams";
import { useUsns } from "@/features/usns";
import { UrlParams } from "@/types/UrlParams";

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
  const { removeUsnPackagesQuery } = useUsns();
  const { setPageParams } = usePageParams();
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();

  const instanceId = Number(urlInstanceId);
  const { mutateAsync: removeUsnPackages, isPending: isRemoving } =
    removeUsnPackagesQuery;

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
    }
  };

  return (
    <ConfirmationButton
      type="button"
      key="remove"
      className="is-small is-dense has-icon"
      confirmationModalProps={{
        title: "Uninstall USN packages",
        children: (
          <p>
            This will uninstall packages affected by &quot;{usn}&quot; security
            issue from the &quot;{instanceTitle}&quot; instance.
          </p>
        ),
        confirmButtonLabel: "Uninstall",
        confirmButtonAppearance: "negative",
        confirmButtonDisabled: isRemoving,
        confirmButtonLoading: isRemoving,
        onConfirm: handleRemoveUsnPackages,
      }}
    >
      <Icon name="delete" className="u-no-margin--left" />
      <span>Uninstall packages</span>
    </ConfirmationButton>
  );
};

export default UsnPackagesRemoveButton;
