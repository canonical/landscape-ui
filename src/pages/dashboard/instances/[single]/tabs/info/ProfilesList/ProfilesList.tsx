import { SidePanelTableFilterChips, TableFilter } from "@/components/filter";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import useAuth from "@/hooks/useAuth";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/libs/pageParamsManager/constants";
import type { ProfileType } from "@/types/Profile";
import { type Profile } from "@/types/Profile";
import { ModularTable, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import ProfileLink from "../ProfileLink/ProfileLink";
import { getProfileType } from "./helpers";
import classes from "./ProfilesList.module.scss";

interface ProfilesListProps {
  readonly profiles: Profile[];
}

const ProfilesList: FC<ProfilesListProps> = ({ profiles }) => {
  const { isFeatureEnabled } = useAuth();

  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState<string[]>([]);

  const columns = useMemo<Column<Profile>[]>(
    () => [
      {
        accessor: "title",
        Header: "Title",
        Cell: ({ row: { original: profile } }: CellProps<Profile>) => (
          <ProfileLink profile={profile} />
        ),
      },
      {
        accessor: "type",
        Header: "Type",
        Cell: ({ row: { original: profile } }: CellProps<Profile>) =>
          getProfileType(profile.type),
      },
    ],
    [],
  );

  const clearSearch = () => {
    setInputValue("");
    setSearch("");
    setCurrentPage(DEFAULT_CURRENT_PAGE);
  };

  const filteredProfiles = [
    ...profiles.filter(
      (profile) => profile.title.toLowerCase() === search.toLowerCase(),
    ),
    ...profiles.filter(
      (profile) =>
        profile.title.toLowerCase() !== search &&
        profile.title.toLowerCase().startsWith(search.toLowerCase()),
    ),
    ...profiles.filter(
      (profile) =>
        profile.title.toLowerCase() !== search.toLowerCase() &&
        !profile.title.toLowerCase().startsWith(search.toLowerCase()) &&
        profile.title.toLowerCase().includes(search.toLowerCase()),
    ),
  ].filter((profile) => !types.length || types.includes(profile.type));

  const currentProfiles = filteredProfiles.slice(
    (currentPage - 1) * pageSize,
    (currentPage - 1) * pageSize + pageSize,
  );

  return (
    <>
      <div className={classes.header}>
        <SearchBox
          className={classNames("u-no-margin--bottom", classes.search)}
          externallyControlled
          value={inputValue}
          onChange={setInputValue}
          onClear={clearSearch}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(DEFAULT_CURRENT_PAGE);
          }}
          autoComplete="off"
        />

        <TableFilter
          type="multiple"
          label="Type"
          onItemsSelect={(value) => {
            setTypes(value);
            setCurrentPage(DEFAULT_CURRENT_PAGE);
          }}
          options={[
            { label: "Package", value: "package" },
            { label: "Reboot", value: "reboot" },
            { label: "Removal", value: "removal" },
            { label: "Repository", value: "repository" },
            isFeatureEnabled("script-profiles") && {
              label: "Script",
              value: "script",
            },
            isFeatureEnabled("usg-profiles") && {
              label: "Security",
              value: "security",
            },
            { label: "Upgrade", value: "upgrade" },
            isFeatureEnabled("wsl-child-instance-profiles") && {
              label: "WSL",
              value: "wsl",
            },
          ].filter((typeOption) => !!typeOption)}
          selectedItems={types}
        />
      </div>

      <SidePanelTableFilterChips
        filters={[
          {
            label: "Search",
            item: search || undefined,
            clear: clearSearch,
          },
          {
            label: "Type",
            items: types.map((type) => ({
              label: getProfileType(type as ProfileType),
              value: type,
            })),
            clear: () => {
              setTypes([]);
              setCurrentPage(DEFAULT_CURRENT_PAGE);
            },
            remove: (value) => {
              setTypes(types.filter((type) => type !== value));
              setCurrentPage(DEFAULT_CURRENT_PAGE);
            },
            multiple: true,
          },
        ]}
      />

      <ModularTable
        columns={columns}
        data={currentProfiles}
        emptyMsg="No profiles found according to your search parameters."
      />

      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={setCurrentPage}
        setPageSize={setPageSize}
        totalItems={filteredProfiles.length}
        currentItemCount={filteredProfiles.length}
      />
    </>
  );
};

export default ProfilesList;
