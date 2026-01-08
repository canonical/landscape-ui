import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Col, Row, Tooltip } from "@canonical/react-components";
import classNames from "classnames";
import { Suspense, type FC } from "react";
import type { SavedSearch } from "../../types";
import ManageSavedSearchesSidePanel from "../ManageSavedSeachesSidePanel";
import classes from "./SavedSearchList.module.scss";
import SavedSearchActions from "../SavedSearchActions";
import { SIDEPANEL_SIZE } from "../../constants";
import { useMediaQuery } from "usehooks-ts";
import { BREAKPOINT_PX } from "@/constants";

interface SavedSearchListProps {
  readonly onSavedSearchClick: (search: SavedSearch) => void;
  readonly savedSearches: SavedSearch[];
  readonly onManageSearches: () => void;
  readonly onSavedSearchRemove: () => void;
}

const SavedSearchList: FC<SavedSearchListProps> = ({
  onSavedSearchClick,
  savedSearches,
  onManageSearches,
  onSavedSearchRemove,
}) => {
  const { setSidePanelContent } = useSidePanel();
  const isLargeScreen = useMediaQuery(`(min-width: ${BREAKPOINT_PX["lg"]}px)`);

  if (!savedSearches.length) {
    return null;
  }

  const handleManageSavedSearches = () => {
    onManageSearches();
    setSidePanelContent(
      "Manage saved searches",
      <Suspense fallback={<LoadingState />}>
        <ManageSavedSearchesSidePanel />
      </Suspense>,
      SIDEPANEL_SIZE,
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <p className="p-text--small-caps u-text--muted p-text--small">
          Saved searches
        </p>
        <Button
          type="button"
          appearance="secondary"
          className="is-small"
          onClick={handleManageSavedSearches}
        >
          Manage
        </Button>
      </div>
      <ul
        className={classNames(
          "p-list--divided u-no-margin--bottom",
          classes.list,
        )}
      >
        {savedSearches.map((savedSearch) => (
          <li key={savedSearch.name}>
            <div className={classes.listItem}>
              <Button
                type="button"
                appearance="base"
                className={classes.search}
                onClick={() => {
                  onSavedSearchClick(savedSearch);
                }}
              >
                <Row className={classes.row}>
                  <Col size={4}>
                    <Tooltip
                      message={savedSearch.title}
                      positionElementClassName={classes.truncated}
                    >
                      <span>{savedSearch.title}</span>
                    </Tooltip>
                  </Col>
                  <Col
                    size={8}
                    className={classNames(
                      !isLargeScreen && classes.searchQuery,
                    )}
                  >
                    <Tooltip
                      message={savedSearch.search}
                      positionElementClassName={classes.truncated}
                    >
                      <code>{savedSearch.search}</code>
                    </Tooltip>
                  </Col>
                </Row>
              </Button>
              <div className={classes.actions}>
                <SavedSearchActions
                  savedSearch={savedSearch}
                  onSavedSearchRemove={onSavedSearchRemove}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedSearchList;
