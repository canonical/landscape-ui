import classNames from "classnames";
import { FC, useMemo } from "react";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import {
  Button,
  Icon,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import PackageProfileDetails from "../PackageProfileDetails";
import PackageProfileListContextualMenu from "../PackageProfileListContextualMenu";
import { PackageProfile } from "../../types";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import { NON_COMPLIANT_TOOLTIP, PENDING_TOOLTIP } from "./constants";
import { getCellProps } from "./helpers";
import classes from "./PackageProfileList.module.scss";
import { usePageParams } from "@/hooks/usePageParams";

interface PackageProfileListProps {
  packageProfiles: PackageProfile[];
}

const PackageProfileList: FC<PackageProfileListProps> = ({
  packageProfiles,
}) => {
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const handlePackageProfileDetailsOpen = (profile: PackageProfile) => {
    setSidePanelContent(
      profile.title,
      <PackageProfileDetails profile={profile} />,
      "medium",
    );
  };

  const profiles = useMemo(() => {
    if (!search) {
      return packageProfiles;
    }

    return packageProfiles.filter((profile) => {
      return profile.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [packageProfiles, search]);

  const columns = useMemo<Column<PackageProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => handlePackageProfileDetailsOpen(original)}
          >
            {original.title}
          </Button>
        ),
      },
      {
        accessor: "description",
        className: classNames(classes.truncated, classes.description),
        Header: "Description",
      },
      {
        accessor: "access_group",
        Header: "Access group",
        Cell: ({
          row: {
            original: { access_group },
          },
        }: CellProps<PackageProfile>) =>
          accessGroupOptions.find(({ value }) => value === access_group)
            ?.label ?? access_group,
      },
      {
        accessor: "tags",
        className: classes.truncated,
        Header: "Tags",
        Cell: ({
          row: {
            original: { tags },
          },
        }: CellProps<PackageProfile>) => tags.join(", "),
      },
      {
        accessor: "computers['non-compliant']",
        Header: (
          <div className={classes.noWrap}>
            <span>Not compliant </span>
            <Tooltip position="btm-left" message={NON_COMPLIANT_TOOLTIP}>
              <Icon name="help" />
            </Tooltip>
          </div>
        ),
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <>
            {`${original.computers["non-compliant"].length} ${original.computers["non-compliant"].length === 1 ? "instance" : "instances"}`}
          </>
        ),
      },
      {
        accessor: "computers['pending']",
        Header: (
          <div className={classes.noWrap}>
            <span>Pending </span>
            <Tooltip position="btm-left" message={PENDING_TOOLTIP}>
              <Icon name="help" />
            </Tooltip>
          </div>
        ),
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <>
            {`${original.computers["pending"]?.length ?? 0} ${original.computers["pending"]?.length === 1 ? "instance" : "instances"}`}
          </>
        ),
      },
      {
        accessor: "computers['constrained']",
        Header: "Associated",
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <>
            {`${original.computers["constrained"].length} ${original.computers["constrained"].length === 1 ? "instance" : "instances"}`}
          </>
        ),
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <PackageProfileListContextualMenu profile={original} />
        ),
      },
    ],
    [profiles, accessGroupOptions.length],
  );

  return (
    <ModularTable
      columns={columns}
      data={profiles}
      emptyMsg={`No package profiles found with the search "${search}"`}
      getCellProps={getCellProps}
    />
  );
};

export default PackageProfileList;
