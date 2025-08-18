import { SidePanelTableFilterChips } from "@/components/filter";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import SidePanel from "@/components/layout/SidePanel";
import StaticLink from "@/components/layout/StaticLink";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetInstances } from "@/features/instances";
import { WindowsInstanceMakeCompliantModal } from "@/features/wsl";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import useSelection from "@/hooks/useSelection";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/libs/pageParamsManager/constants";
import type { WindowsInstance } from "@/types/Instance";
import {
  Button,
  CheckboxInput,
  Icon,
  SearchBox,
} from "@canonical/react-components";
import classNames from "classnames";
import moment from "moment";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { useBoolean } from "usehooks-ts";
import type { WslProfileSidePanelComponentProps } from "../WslProfileSidePanel";
import WslProfileSidePanel from "../WslProfileSidePanel";
import classes from "./WslProfileNonCompliantInstancesList.module.scss";
import WindowsInstanceActions from "./components/WindowsInstanceActions";
import { getCellProps, getRowProps } from "./helpers";

const Component: FC<WslProfileSidePanelComponentProps> = ({ wslProfile }) => {
  const { expandedRowIndex, getTableRowsRef, handleExpand } =
    useExpandableRow();
  const [inputValue, setInputValue] = useState("");
  const [currentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");

  const { instances, isGettingInstances } = useGetInstances({
    query: [search, `profile:wsl:${wslProfile.id}:noncompliant`]
      .filter(Boolean)
      .join(" "),
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    with_wsl_profiles: true,
  });

  const {
    selectedItems: selectedInstances,
    setSelectedItems: setSelectedInstances,
  } = useSelection(instances, isGettingInstances);

  const {
    value: isMakeCompliantModalOpen,
    setTrue: openMakeCompliantModal,
    setFalse: closeMakeCompliantModal,
  } = useBoolean();

  const columns = useMemo<Column<WindowsInstance>[]>(
    () => [
      {
        accessor: "title",
        Header: (
          <>
            <CheckboxInput
              label={<span className="u-off-screen">Toggle all instances</span>}
              inline
              disabled={!instances.length}
              indeterminate={
                !!selectedInstances.length &&
                selectedInstances.length < instances.length
              }
              checked={
                !!instances.length &&
                selectedInstances.length === instances.length
              }
              onChange={({ currentTarget: { checked } }) => {
                setSelectedInstances(checked ? instances : []);
              }}
            />
            Instance name
          </>
        ),
        Cell: ({ row: { original: instance } }: CellProps<WindowsInstance>) => (
          <>
            <CheckboxInput
              inline
              label={
                <span className="u-off-screen">Select {instance.title}</span>
              }
              checked={selectedInstances.includes(instance)}
              onChange={({ currentTarget: { checked } }) => {
                setSelectedInstances(
                  checked
                    ? [...selectedInstances, instance]
                    : selectedInstances.filter((i) => i !== instance),
                );
              }}
            />

            <StaticLink to={`/instances/${instance.id}`}>
              {instance.title}
            </StaticLink>
          </>
        ),
      },
      {
        Header: "OS",
        Cell: ({ row: { original: instance } }: CellProps<WindowsInstance>) =>
          instance.distribution_info?.description,
      },
      {
        accessor: "profiles",
        Header: "WSL profiles",
        Cell: ({
          row: { original: instance, index },
        }: CellProps<WindowsInstance>) => (
          <TruncatedCell
            content={instance.wsl_profiles
              ?.map((profile) => profile.title)
              .join(", ")}
            isExpanded={index === expandedRowIndex}
            onExpand={() => {
              handleExpand(index);
            }}
          />
        ),
      },
      {
        Header: "Last ping",
        Cell: ({ row: { original: instance } }: CellProps<WindowsInstance>) => {
          const dateTime = moment(instance.last_ping_time);

          if (dateTime.isValid()) {
            return (
              <span className="font-monospace">
                {dateTime.format(DISPLAY_DATE_TIME_FORMAT)}
              </span>
            );
          } else {
            return <NoData />;
          }
        },
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original: instance } }: CellProps<WindowsInstance>) => (
          <WindowsInstanceActions instance={instance as WindowsInstance} />
        ),
      },
    ],
    [instances, selectedInstances, expandedRowIndex],
  );

  const clear = () => {
    setInputValue("");
    setSearch("");
  };

  return (
    <>
      <SidePanel.Header>
        Instances not compliant with {wslProfile.title}
      </SidePanel.Header>
      <SidePanel.Content>
        <div className={classes.header}>
          <SearchBox
            className={classNames("u-no-margin--bottom", classes.search)}
            externallyControlled
            value={inputValue}
            onChange={setInputValue}
            onClear={clear}
            onSearch={setSearch}
            autoComplete="off"
          />

          <Button
            type="button"
            className="u-no-margin"
            hasIcon
            onClick={openMakeCompliantModal}
            disabled={!selectedInstances.length}
          >
            <Icon name="security-tick" />
            <span>Make compliant</span>
          </Button>
        </div>

        <SidePanelTableFilterChips
          filters={[
            {
              label: "Search",
              item: search || undefined,
              clear,
            },
          ]}
        />

        {isGettingInstances ? (
          <LoadingState />
        ) : (
          <div ref={getTableRowsRef}>
            <ResponsiveTable
              columns={columns}
              data={instances as WindowsInstance[]}
              emptyMsg="No Windows instances found according to your search parameters."
              getCellProps={getCellProps(expandedRowIndex)}
              getRowProps={getRowProps(expandedRowIndex)}
            />
          </div>
        )}

        <WindowsInstanceMakeCompliantModal
          close={closeMakeCompliantModal}
          instances={selectedInstances as WindowsInstance[]}
          isOpen={isMakeCompliantModalOpen}
        />
      </SidePanel.Content>
    </>
  );
};

const WslProfileNonCompliantInstancesList: FC = () => (
  <WslProfileSidePanel Component={Component} />
);

export default WslProfileNonCompliantInstancesList;
