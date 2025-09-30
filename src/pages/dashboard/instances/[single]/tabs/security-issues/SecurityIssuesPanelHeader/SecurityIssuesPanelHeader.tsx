import { TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { useUsns } from "@/features/usns";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { UrlParams } from "@/types/UrlParams";
import { ConfirmationButton, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useNavigate, useParams } from "react-router";
import classes from "./SecurityIssuesPanelHeader.module.scss";
import { pluralize } from "@/utils/_helpers";
import { ROUTES } from "@/libs/routes";

interface SecurityIssuesPanelHeaderProps {
  readonly usns: string[];
}

const SecurityIssuesPanelHeader: FC<SecurityIssuesPanelHeaderProps> = ({
  usns,
}) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const navigate = useNavigate();
  const debug = useDebug();
  const { notify } = useNotify();
  const { upgradeInstanceUsnsQuery } = useUsns();

  const instanceId = Number(urlInstanceId);

  const { mutateAsync: upgradeInstanceUsns, isPending: isUpgrading } =
    upgradeInstanceUsnsQuery;

  const handleActivityDetailsView = () => {
    navigate(
      ROUTES.instances.details.fromParams(
        { instanceId: urlInstanceId, childInstanceId },
        { tab: "activities" },
      ),
    );

    notify.clear();
  };

  const handleUpgradePackages = async () => {
    try {
      await upgradeInstanceUsns({
        instanceId: instanceId,
        usns,
      });

      notify.success({
        title: `You queued packages to be upgraded`,
        message: `Affected packages for ${pluralize(usns.length, `"${usns[0]}" security issue`, `${usns.length} selected security issues`)} will be upgraded and are queued in Activities`,
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
    <>
      <HeaderWithSearch
        actions={
          <div className={classNames("p-segmented-control", classes.actions)}>
            <ConfirmationButton
              className="p-segmented-control__button has-icon u-no-margin--bottom"
              type="button"
              disabled={usns.length === 0}
              confirmationModalProps={{
                title: "Upgrade affected packages",
                children: (
                  <p>
                    This will upgrade affected packages for{" "}
                    {pluralize(
                      usns.length,
                      `"${usns[0]}" security issue`,
                      `${usns.length} selected security issues`,
                    )}
                    .
                  </p>
                ),
                confirmButtonLabel: "Upgrade",
                confirmButtonAppearance: "positive",
                confirmButtonLoading: isUpgrading,
                confirmButtonDisabled: isUpgrading,
                onConfirm: handleUpgradePackages,
              }}
            >
              <Icon name="change-version" />
              <span>Upgrade</span>
            </ConfirmationButton>
          </div>
        }
      />
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default SecurityIssuesPanelHeader;
