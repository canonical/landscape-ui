import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ConfirmationButton,
  Form,
  Icon,
  SearchBox,
} from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { useUsns } from "@/features/usns";
import classes from "./SecurityIssuesPanelHeader.module.scss";
import { usePageParams } from "@/hooks/usePageParams";
import { UrlParams } from "@/types/UrlParams";

interface SecurityIssuesPanelHeaderProps {
  onSearch: (searchText: string) => void;
  usns: string[];
}

const SecurityIssuesPanelHeader: FC<SecurityIssuesPanelHeaderProps> = ({
  onSearch,
  usns,
}) => {
  const [inputText, setInputText] = useState("");

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const { setPageParams } = usePageParams();
  const navigate = useNavigate();
  const debug = useDebug();
  const { notify } = useNotify();
  const { upgradeInstanceUsnsQuery } = useUsns();

  const instanceId = Number(urlInstanceId);

  const { mutateAsync: upgradeInstanceUsns, isPending: isUpgrading } =
    upgradeInstanceUsnsQuery;

  const handleActivityDetailsView = () => {
    navigate(
      `${ROOT_PATH}instances/${childInstanceId ? `${instanceId}/${childInstanceId}` : `${instanceId}`}`,
    );
    setPageParams({ tab: "activities" });
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
        message: `Affected packages for ${usns.length === 1 ? `"${usns[0]}" security issue` : `${usns.length} selected security issues`} will be upgraded and are queued in Activities`,
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
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(inputText);
          }}
          noValidate
        >
          <SearchBox
            shouldRefocusAfterReset
            externallyControlled
            autocomplete="off"
            value={inputText}
            onChange={(inputValue) => setInputText(inputValue)}
            onSearch={() => onSearch(inputText)}
            onClear={() => {
              setInputText("");
              onSearch("");
            }}
          />
        </Form>
      </div>
      <div className="p-segmented-control">
        <ConfirmationButton
          className="p-segmented-control__button has-icon"
          type="button"
          disabled={usns.length === 0}
          confirmationModalProps={{
            title: "Upgrade affected packages",
            children: (
              <p>
                This will upgrade affected packages for{" "}
                {usns.length === 1
                  ? `"${usns[0]}" security issue`
                  : `${usns.length} selected security issues`}
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
    </div>
  );
};

export default SecurityIssuesPanelHeader;
