import classNames from "classnames";
import type { FC } from "react";
import {
  Button,
  Col,
  ConfirmationButton,
  Icon,
  Row,
  Tooltip,
} from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import { useSavedSearches } from "../../hooks";
import type { SavedSearch } from "../../types";
import classes from "./SavedSearchList.module.scss";
import useNotify from "@/hooks/useNotify";

interface SavedSearchListProps {
  readonly onSavedSearchClick: (search: SavedSearch) => void;
  readonly onSavedSearchRemove: () => void;
  readonly savedSearches: SavedSearch[];
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
  const { removeSavedSearchQuery } = useSavedSearches();

  const { mutateAsync: removeSavedSearch, isPending: isRemoving } =
    removeSavedSearchQuery;

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
    }
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
                type="button"
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
              <ConfirmationButton
                className="has-icon u-no-margin--bottom u-no-padding--bottom u-no-padding--top"
                type="button"
                appearance="base"
                confirmationModalProps={{
                  title: "Remove saved search",
                  children: (
                    <p>
                      This will remove the saved search &quot;{savedSearch.name}
                      &quot;.
                    </p>
                  ),
                  confirmButtonLabel: "Remove",
                  confirmButtonAppearance: "negative",
                  confirmButtonDisabled: isRemoving,
                  confirmButtonLoading: isRemoving,
                  onConfirm: () => handleSavedSearchRemove(savedSearch.name),
                }}
              >
                <Icon name="delete" />
              </ConfirmationButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedSearchList;
