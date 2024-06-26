import classNames from "classnames";
import { FC } from "react";
import { Button, Col, Icon, Row, Tooltip } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { SavedSearch } from "@/types/SavedSearch";
import classes from "./SavedSearchList.module.scss";
import useNotify from "@/hooks/useNotify";
import useConfirm from "@/hooks/useConfirm";

interface SavedSearchListProps {
  onSavedSearchClick: (search: SavedSearch) => void;
  onSavedSearchRemove: () => void;
  savedSearches: SavedSearch[];
}

const SavedSearchList: FC<SavedSearchListProps> = ({
  onSavedSearchClick,
  onSavedSearchRemove,
  savedSearches,
}) => {
  if (!savedSearches.length) {
    return null;
  }

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { removeSavedSearchQuery } = useSavedSearches();

  const { mutateAsync: removeSavedSearch } = removeSavedSearchQuery;

  const handleSavedSearchRemove = async (name: string) => {
    try {
      await removeSavedSearch({ name });

      onSavedSearchRemove();

      notify.success({
        message: `Saved search ${name} successfully removed`,
        title: "Saved search removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleSavedSearchRemoveDiaLog = (name: string) => {
    confirmModal({
      title: "Remove saved search",
      body: `This will remove the saved search "${name}"`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleSavedSearchRemove(name)}
          aria-label={`Remove ${name} search`}
        >
          Remove
        </Button>,
      ],
    });
  };

  return (
    <div className={classes.container}>
      <p className="p-text--small-caps u-text--muted p-text--small">
        Saved searches
      </p>
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
                appearance="base"
                className={classes.search}
                onClick={() => onSavedSearchClick(savedSearch)}
              >
                <Row className={classes.row}>
                  <Col size={4}>
                    <Tooltip
                      message={savedSearch.name}
                      positionElementClassName={classes.truncated}
                    >
                      <span>{savedSearch.name}</span>
                    </Tooltip>
                  </Col>
                  <Col size={8}>
                    <Tooltip
                      message={savedSearch.search}
                      positionElementClassName={classes.truncated}
                    >
                      <span>{savedSearch.search}</span>
                    </Tooltip>
                  </Col>
                </Row>
              </Button>

              <Button
                type="button"
                appearance="base"
                hasIcon
                className="u-no-margin--bottom u-no-padding--bottom u-no-padding--top"
                onClick={() => handleSavedSearchRemoveDiaLog(savedSearch.name)}
                aria-label={`Remove ${savedSearch.title} search`}
              >
                <Icon name="delete" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedSearchList;
