import { ChangeEvent, FC, SyntheticEvent, useState } from "react";
import useDebug from "../../hooks/useDebug";
import useActivities from "../../hooks/useActivities";
import { Button, Form, Select } from "@canonical/react-components";
import SearchBoxWithDescriptionButton from "../form/SearchBoxWithDescriptionButton";
import SearchHelpPopup from "../layout/SearchHelpPopup";
import useConfirm from "../../hooks/useConfirm";
import { ACTIVITY_SEARCH_HELP_TERMS, ACTIVITY_STATUS_OPTIONS } from "./_data";
import classes from "./ActivitiesHeader.module.scss";
import classNames from "classnames";

interface ActivitiesHeaderProps {
  resetPage: () => void;
  resetSelectedIds: () => void;
  selectedIds: number[];
  setSearchQuery: (newSearchQuery: string) => void;
}

const ActivitiesHeader: FC<ActivitiesHeaderProps> = ({
  resetPage,
  resetSelectedIds,
  selectedIds,
  setSearchQuery,
}) => {
  const [showSearchHelp, setShowSearchHelp] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { approveActivitiesQuery, cancelActivitiesQuery } = useActivities();

  const {
    mutateAsync: approveActivities,
    isLoading: approveActivitiesLoading,
  } = approveActivitiesQuery;
  const { mutateAsync: cancelActivities, isLoading: cancelActivitiesLoading } =
    cancelActivitiesQuery;

  const handleResetPage = () => {
    resetPage();
    resetSelectedIds();
  };

  const handleSearch = () => {
    if (searchText) {
      setSearchQuery(
        `${searchText}${statusFilter ? ` status:${statusFilter}` : ""}`,
      );
    } else {
      setSearchQuery(statusFilter ? `status:${statusFilter}` : "");
    }
    handleResetPage();
  };

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newFilter = event.target.value;

    setStatusFilter(newFilter);

    if (newFilter) {
      setSearchQuery(
        `status:${newFilter}${searchText ? ` ${searchText}` : ""}`,
      );
    } else {
      setSearchQuery(searchText);
    }

    handleResetPage();
  };

  const handleClear = () => {
    setSearchText("");
    setSearchQuery(statusFilter ? `status:${statusFilter}` : "");
    handleResetPage();
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    handleSearch();
  };

  const handleApproveActivities = () => {
    confirmModal({
      title: "Approve activities",
      body: "Are you sure you want to approve selected activities?",
      buttons: [
        <Button
          key="approve"
          appearance="positive"
          onClick={async () => {
            const query = `id:${selectedIds.join(" OR id:")}`;

            try {
              await approveActivities({ query });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Approve
        </Button>,
      ],
    });
  };

  const handleCancelActivities = () => {
    confirmModal({
      title: "Cancel activities",
      body: "Are you sure you want to cancel selected activities?",
      buttons: [
        <Button
          key="cancel"
          appearance="positive"
          onClick={async () => {
            const query = `id:${selectedIds.join(" OR id:")}`;

            try {
              await cancelActivities({ query });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Apply
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
        value={statusFilter}
        onChange={handleFilterChange}
      />

      <div
        key="buttons"
        className={classNames("p-segmented-control", classes.cta)}
      >
        <div className="p-segmented-control__list">
          <Button
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            onClick={handleApproveActivities}
            disabled={approveActivitiesLoading || selectedIds.length === 0}
          >
            <span>Approve</span>
          </Button>
          <Button
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            onClick={handleCancelActivities}
            disabled={cancelActivitiesLoading || selectedIds.length === 0}
          >
            <span>Cancel</span>
          </Button>
          <Button
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            onClick={() => {}}
            disabled={selectedIds.length === 0}
          >
            <span>Undo</span>
          </Button>
          <Button
            className="p-segmented-control__button u-no-margin--bottom"
            type="button"
            onClick={() => {}}
            disabled={selectedIds.length === 0}
          >
            <span>Redo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesHeader;
