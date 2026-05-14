import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Col, Row, Tooltip } from "@canonical/react-components";
import classNames from "classnames";
import { Suspense, useEffect, type FC } from "react";
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
  readonly activeIndex?: number | null;
  readonly itemIdPrefix?: string;
}

const SavedSearchList: FC<SavedSearchListProps> = ({
  onSavedSearchClick,
  savedSearches,
  onManageSearches,
  onSavedSearchRemove,
  activeIndex = null,
  itemIdPrefix,
}) => {
  const { setSidePanelContent } = useSidePanel();
  const isLargeScreen = useMediaQuery(`(min-width: ${BREAKPOINT_PX["lg"]}px)`);

  // aria-activedescendant doesn't move DOM focus, so scroll the active item ourselves.
  useEffect(() => {
    if (activeIndex === null || !itemIdPrefix) {
      return;
    }
    const activeItem = document.getElementById(
      `${itemIdPrefix}-${activeIndex}`,
    );
    activeItem?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, itemIdPrefix]);

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
        {savedSearches.map((savedSearch, index) => (
          <li key={savedSearch.name}>
            <div
              className={classNames(classes.listItem, {
                [classes.activeItem]: index === activeIndex,
              })}
            >
              <Button
                type="button"
                appearance="base"
                id={
                  itemIdPrefix ? `${itemIdPrefix}-${index}` : undefined
                }
                aria-selected={index === activeIndex || undefined}
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
