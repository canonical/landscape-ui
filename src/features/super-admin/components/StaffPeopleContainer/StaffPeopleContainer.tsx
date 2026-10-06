import { PageParamFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useGetStaffPeople } from "../../api";
import {
  STAFF_PEOPLE_SEARCH_MIN_LENGTH,
  STAFF_PEOPLE_TYPE_OPTIONS,
} from "../../constants";
import { toStaffPeopleResultType } from "../../helpers";
import StaffPeopleList from "../StaffPeopleList";

const StaffPeopleContainer: FC = () => {
  const { currentPage, pageSize, search, type } = usePageParams();

  const canSearch = search.length >= STAFF_PEOPLE_SEARCH_MIN_LENGTH;

  const {
    staffPeople,
    staffPeopleCount,
    staffPeopleError,
    isGettingStaffPeople,
  } = useGetStaffPeople({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search,
    type: toStaffPeopleResultType(type),
  });

  if (staffPeopleError) {
    throw staffPeopleError;
  }

  const getContent = () => {
    if (!canSearch) {
      return (
        <EmptyState
          title="Search for a user or a pending invitation"
          body={`Enter at least ${STAFF_PEOPLE_SEARCH_MIN_LENGTH} characters of a name or an email, or a whole Salesforce key.`}
        />
      );
    }

    if (isGettingStaffPeople) {
      return <LoadingState />;
    }

    return <StaffPeopleList staffPeople={staffPeople} />;
  };

  return (
    <>
      <HeaderWithSearch
        placeholder="Search by name, email or Salesforce key"
        actions={
          <PageParamFilter
            pageParamKey="type"
            label="Type"
            options={STAFF_PEOPLE_TYPE_OPTIONS}
          />
        }
      />
      <TableFilterChips
        filtersToDisplay={["type"]}
        typeOptions={[...STAFF_PEOPLE_TYPE_OPTIONS]}
      />
      {getContent()}
      {canSearch && (
        <TablePagination
          totalItems={staffPeopleCount}
          currentItemCount={staffPeople.length}
          pageSizeLabel="People per page"
        />
      )}
    </>
  );
};

export default StaffPeopleContainer;
