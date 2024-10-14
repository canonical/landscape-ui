import classNames from "classnames";
import { FC, SyntheticEvent, useState } from "react";
import { ConfirmationButton, Form, Select } from "@canonical/react-components";
import SearchBoxWithDescriptionButton from "@/components/form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "@/components/layout/SearchHelpPopup";
import { useActivities } from "../../hooks";
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
    isPending: approveActivitiesLoading,
  } = approveActivitiesQuery;
  const { mutateAsync: cancelActivities, isPending: cancelActivitiesLoading } =
    cancelActivitiesQuery;
  const { mutateAsync: redoActivities, isPending: redoActivitiesLoading } =
    redoActivitiesQuery;
  const { mutateAsync: undoActivities, isPending: undoActivitiesLoading } =
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
    }
  };

  const handleCancelActivities = async () => {
    try {
      await cancelActivities({ query: `id:${selectedIds.join(" OR id:")}` });
    } catch (error) {
      debug(error);
    }
  };

  const handleRedoActivities = async () => {
    try {
      await redoActivities({ activity_ids: selectedIds });
    } catch (error) {
      debug(error);
    }
  };

  const handleUndoActivities = async () => {
    try {
      await undoActivities({ activity_ids: selectedIds });
    } catch (error) {
      debug(error);
    }
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
          <ConfirmationButton
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            disabled={selectedIds.length === 0 || approveActivitiesLoading}
            confirmationModalProps={{
              title: `Approve ${selectedIds.length === 1 ? "activity" : "activities"}`,
              children: (
                <p>
                  Are you sure you want to approve selected{" "}
                  {selectedIds.length === 1 ? "activity" : "activities"}?
                </p>
              ),
              confirmButtonLabel: "Approve",
              confirmButtonAppearance: "positive",
              confirmButtonDisabled: approveActivitiesLoading,
              confirmButtonLoading: approveActivitiesLoading,
              onConfirm: handleApproveActivities,
            }}
          >
            Approve
          </ConfirmationButton>
          <ConfirmationButton
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            disabled={selectedIds.length === 0 || cancelActivitiesLoading}
            confirmationModalProps={{
              title: `Cancel ${selectedIds.length === 1 ? "activity" : "activities"}`,
              children: (
                <p>
                  Are you sure you want to cancel selected{" "}
                  {selectedIds.length === 1 ? "activity" : "activities"}?
                </p>
              ),
              confirmButtonLabel: "Apply",
              confirmButtonAppearance: "positive",
              confirmButtonDisabled: cancelActivitiesLoading,
              confirmButtonLoading: cancelActivitiesLoading,
              onConfirm: handleCancelActivities,
            }}
          >
            Cancel
          </ConfirmationButton>
          <ConfirmationButton
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            disabled={selectedIds.length === 0 || undoActivitiesLoading}
            confirmationModalProps={{
              title: `Undo ${selectedIds.length === 1 ? "activity" : "activities"}`,
              children: (
                <p>
                  Are you sure you want to undo selected{" "}
                  {selectedIds.length === 1 ? "activity" : "activities"}?
                </p>
              ),
              confirmButtonLabel: "Undo",
              confirmButtonAppearance: "positive",
              confirmButtonDisabled: undoActivitiesLoading,
              confirmButtonLoading: undoActivitiesLoading,
              onConfirm: handleUndoActivities,
            }}
          >
            Undo
          </ConfirmationButton>
          <ConfirmationButton
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            disabled={selectedIds.length === 0 || redoActivitiesLoading}
            confirmationModalProps={{
              title: `Redo ${selectedIds.length === 1 ? "activity" : "activities"}`,
              children: (
                <p>
                  Are you sure you want to redo selected{" "}
                  {selectedIds.length === 1 ? "activity" : "activities"}?
                </p>
              ),
              confirmButtonLabel: "Redo",
              confirmButtonAppearance: "positive",
              confirmButtonDisabled: redoActivitiesLoading,
              confirmButtonLoading: redoActivitiesLoading,
              onConfirm: handleRedoActivities,
            }}
          >
            Redo
          </ConfirmationButton>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesHeader;
