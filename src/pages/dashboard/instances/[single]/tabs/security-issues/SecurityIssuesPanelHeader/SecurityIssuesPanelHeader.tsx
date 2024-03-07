import { FC, useState } from "react";
import { Button, Form, Icon, SearchBox } from "@canonical/react-components";
import classes from "./SecurityIssuesPanelHeader.module.scss";
import classNames from "classnames";
import useDebug from "@/hooks/useDebug";
import useConfirm from "@/hooks/useConfirm";
import useUsns from "@/hooks/useUsns";
import useNotify from "@/hooks/useNotify";
import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "@/constants";
import { Instance } from "@/types/Instance";

interface SecurityIssuesPanelHeaderProps {
  instance: Instance;
  onSearch: (searchText: string) => void;
  usns: string[];
}

const SecurityIssuesPanelHeader: FC<SecurityIssuesPanelHeaderProps> = ({
  instance,
  onSearch,
  usns,
}) => {
  const [inputText, setInputText] = useState("");

  const navigate = useNavigate();
  const debug = useDebug();
  const { notify } = useNotify();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { upgradeUsnPackagesQuery } = useUsns();

  const {
    mutateAsync: upgradeUsnPackages,
    isLoading: upgradeUsnPackagesLoading,
  } = upgradeUsnPackagesQuery;

  const handleActivityDetailsView = () => {
    navigate(
      `${ROOT_PATH}instances/${instance.parent ? `${instance.parent.hostname}/${instance.hostname}` : instance.hostname}`,
      { state: { tab: "activities" } },
    );

    notify.clear();
  };

  const handleUpgradePackages = async () => {
    try {
      await upgradeUsnPackages({
        instanceId: instance.id,
        usns,
      });

      notify.success({
        title: `You queued packages to be upgraded`,
        message: `Affected packages for ${usns.length > 1 ? `${usns.length} selected security issues` : `"${usns[0]}" security issue`} will be upgraded and are queued in Activities`,
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

  const handleUpgradePackagesDialog = () => {
    confirmModal({
      title: "Upgrade affected packages",
      body: `This will upgrade affected packages for ${usns.length > 1 ? `${usns.length} selected security issues` : `"${usns[0]}" security issue`}.`,
      buttons: [
        <Button
          key="upgrade"
          appearance="positive"
          onClick={handleUpgradePackages}
          disabled={upgradeUsnPackagesLoading}
          aria-label="Upgrade selected packages"
        >
          Upgrade
        </Button>,
      ],
    });
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
      <div className={classNames("p-segmented-control", classes.cta)}>
        <Button
          hasIcon
          className="p-segmented-control__button"
          onClick={handleUpgradePackagesDialog}
          disabled={usns.length === 0}
        >
          <Icon name="change-version" />
          <span>Upgrade</span>
        </Button>
      </div>
    </div>
  );
};

export default SecurityIssuesPanelHeader;
