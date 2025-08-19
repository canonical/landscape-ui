import { SidePanelTableFilterChips, TableFilter } from "@/components/filter";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { getFeatures } from "@/features/instances";
import useAuth from "@/hooks/useAuth";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/libs/pageParamsManager/constants";
import type { InstanceWithoutRelation } from "@/types/Instance";
import type { ProfileType } from "@/types/Profile";
import { type Profile } from "@/types/Profile";
import { ModularTable, SearchBox } from "@canonical/react-components";
import classNames from "classnames";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import ProfileLink from "../ProfileLink";
import { FILTER_OPTIONS } from "./constants";
import { getProfileType } from "./helpers";
import classes from "./ProfilesList.module.scss";

interface ProfilesListProps {
  readonly instance: InstanceWithoutRelation;
}

const ProfilesList: FC<ProfilesListProps> = ({ instance }) => {
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

  const filteredProfiles = instance.profiles
    ? [
        ...instance.profiles.filter(
          (profile) => profile.title.toLowerCase() === search.toLowerCase(),
        ),
        ...instance.profiles.filter(
          (profile) =>
            profile.title.toLowerCase() !== search &&
            profile.title.toLowerCase().startsWith(search.toLowerCase()),
        ),
        ...instance.profiles.filter(
          (profile) =>
            profile.title.toLowerCase() !== search.toLowerCase() &&
            !profile.title.toLowerCase().startsWith(search.toLowerCase()) &&
            profile.title.toLowerCase().includes(search.toLowerCase()),
        ),
      ].filter((profile) => !types.length || types.includes(profile.type))
    : [];

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
          position="right"
          options={[
            getFeatures(instance).packages && FILTER_OPTIONS.package,
            getFeatures(instance).power && FILTER_OPTIONS.reboot,
            FILTER_OPTIONS.removal,
            getFeatures(instance).packages && FILTER_OPTIONS.repository,
            getFeatures(instance).scripts &&
              isFeatureEnabled("script-profiles") &&
              FILTER_OPTIONS.script,
            getFeatures(instance).usg &&
              isFeatureEnabled("usg-profiles") &&
              FILTER_OPTIONS.security,
            getFeatures(instance).packages && FILTER_OPTIONS.upgrade,
            getFeatures(instance).wsl &&
              isFeatureEnabled("wsl-child-instance-profiles") &&
              FILTER_OPTIONS.wsl,
          ].filter((typeOption) => !!typeOption)}
          disabledOptions={Object.entries(FILTER_OPTIONS)
            .filter(
              ([type]) =>
                !instance.profiles?.some((profile) => profile.type === type),
            )
            .map(([, option]) => option)}
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
