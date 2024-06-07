import classNames from "classnames";
import { FC, SyntheticEvent, useState } from "react";
import { Button, Form, Select } from "@canonical/react-components";
import SearchBoxWithDescriptionButton from "@/components/form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import { useActivities } from "@/features/activities/hooks";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import classes from "./ActivitiesHeader.module.scss";
import {
  ACTIVITY_SEARCH_HELP_TERMS,
  ACTIVITY_STATUS_OPTIONS,
} from "./constants";
import { usePageParams } from "@/hooks/usePageParams";

interface ActivitiesHeaderProps {
  resetSelectedIds: () => void;
  selectedIds: number[];
}

const ActivitiesHeader: FC<ActivitiesHeaderProps> = ({
  resetSelectedIds,
  selectedIds,
}) => {
  const { search, status, setPageParams } = usePageParams();
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const {
    approveActivitiesQuery,
    cancelActivitiesQuery,
    redoActivitiesQuery,
    undoActivitiesQuery,
  } = useActivities();

  const [searchText, setSearchText] = useState(search);
  const [showSearchHelp, setShowSearchHelp] = useState(false);

  const {
    mutateAsync: approveActivities,
    isLoading: approveActivitiesLoading,
  } = approveActivitiesQuery;
  const { mutateAsync: cancelActivities, isLoading: cancelActivitiesLoading } =
    cancelActivitiesQuery;
  const { mutateAsync: redoActivities, isLoading: redoActivitiesLoading } =
    redoActivitiesQuery;
  const { mutateAsync: undoActivities, isLoading: undoActivitiesLoading } =
    undoActivitiesQuery;

  const handleSearch = () => {
    setPageParams({
      search: searchText,
      status: status,
    });
    resetSelectedIds();
  };

  const handleFilterChange = (newStatus: string) => {
    setPageParams({
      status: newStatus,
    });
  };

  const handleClear = () => {
    setPageParams({
      search: "",
    });
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    handleSearch();
  };

  const handleApproveActivities = async () => {
    try {
      await approveActivities({ query: `id:${selectedIds.join(" OR id:")}` });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleApproveActivitiesDialog = () => {
    confirmModal({
      title: `Approve ${selectedIds.length === 1 ? "activity" : "activities"}`,
      body: `Are you sure you want to approve selected ${selectedIds.length === 1 ? "activity" : "activities"}?`,
      buttons: [
        <Button
          key="approve"
          appearance="positive"
          onClick={handleApproveActivities}
        >
          Approve
        </Button>,
      ],
    });
  };

  const handleCancelActivities = async () => {
    try {
      await cancelActivities({ query: `id:${selectedIds.join(" OR id:")}` });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleCancelActivitiesDialog = () => {
    confirmModal({
      title: `Cancel ${selectedIds.length === 1 ? "activity" : "activities"}`,
      body: `Are you sure you want to cancel selected ${selectedIds.length === 1 ? "activity" : "activities"}?`,
      buttons: [
        <Button
          key="cancel"
          appearance="positive"
          onClick={handleCancelActivities}
        >
          Apply
        </Button>,
      ],
    });
  };

  const handleRedoActivities = async () => {
    try {
      await redoActivities({ activityIds: selectedIds });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRedoActivitiesDialog = () => {
    confirmModal({
      title: `Redo ${selectedIds.length === 1 ? "activity" : "activities"}`,
      body: `Are you sure you want to redo selected ${selectedIds.length === 1 ? "activity" : "activities"}?`,
      buttons: [
        <Button key="redo" appearance="positive" onClick={handleRedoActivities}>
          Redo
        </Button>,
      ],
    });
  };

  const handleUndoActivities = async () => {
    try {
      await undoActivities({ activityIds: selectedIds });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleUndoActivitiesDialog = () => {
    confirmModal({
      title: `Undo ${selectedIds.length === 1 ? "activity" : "activities"}`,
      body: `Are you sure you want to undo selected ${selectedIds.length === 1 ? "activity" : "activities"}?`,
      buttons: [
        <Button key="undo" appearance="positive" onClick={handleUndoActivities}>
          Undo
        </Button>,
      ],
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <Form onSubmit={handleSubmit} noValidate>
          <SearchBoxWithDescriptionButton
            inputValue={searchText}
            onInputChange={(inputValue) => {
              setSearchText(inputValue);
            }}
            onSearchClick={handleSearch}
            onDescriptionClick={() => setShowSearchHelp(true)}
            onClear={handleClear}
          />
        </Form>
        <SearchHelpPopup
          open={showSearchHelp}
          onClose={() => {
            setShowSearchHelp(false);
          }}
          data={ACTIVITY_SEARCH_HELP_TERMS}
        />
      </div>

      <Select
        label="Status"
        labelClassName="u-no-margin--bottom"
        wrapperClassName={classes.select}
        className="u-no-margin--bottom"
        options={ACTIVITY_STATUS_OPTIONS}
        onChange={(event) => handleFilterChange(event.target.value)}
        value={status}
      />

      <div
        key="buttons"
        className={classNames("p-segmented-control", classes.cta)}
      >
        <div className="p-segmented-control__list">
          <Button
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            onClick={handleApproveActivitiesDialog}
            disabled={selectedIds.length === 0 || approveActivitiesLoading}
          >
            Approve
          </Button>
          <Button
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            onClick={handleCancelActivitiesDialog}
            disabled={selectedIds.length === 0 || cancelActivitiesLoading}
          >
            Cancel
          </Button>
          <Button
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            onClick={handleUndoActivitiesDialog}
            disabled={selectedIds.length === 0 || undoActivitiesLoading}
          >
            Undo
          </Button>
          <Button
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            onClick={handleRedoActivitiesDialog}
            disabled={selectedIds.length === 0 || redoActivitiesLoading}
          >
            Redo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesHeader;
