import SidePanelTableFilterChips from "@/components/filter/TableFilterChips/components/SidePanelTableFilterChips";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetInstances } from "@/features/instances";
import { WindowsInstanceMakeCompliantModal } from "@/features/wsl";
import useSelection from "@/hooks/useSelection";
import {
  DEFAULT_CURRENT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "@/libs/pageParamsManager/constants";
import type {
  Instance,
  WindowsInstance,
  WslInstance,
  WslInstanceWithoutRelation,
} from "@/types/Instance";
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
import type { WslProfile } from "../../types";
import classes from "./WslProfileNonCompliantInstancesList.module.scss";
import WindowsInstanceActions from "./components/WindowsInstanceActions";
import WslInstanceActions from "./components/WslInstanceActions";

interface WslProfileNonCompliantInstancesListProps {
  readonly wslProfile: WslProfile;
}

const WslProfileNonCompliantInstancesList: FC<
  WslProfileNonCompliantInstancesListProps
> = ({ wslProfile }) => {
  const [inputValue, setInputValue] = useState("");
  const [currentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");

  const { instances, isGettingInstances } = useGetInstances({
    query: `${search} profile:wsl:${wslProfile.id}:noncompliant`.trim(),
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
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

  const columns = useMemo<Column<Instance>[]>(
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
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => {
          if (instance.is_wsl_instance) {
            return (
              <>
                <span>
                  <Icon className={classes.arrow} name="arrow-down-right" />
                </span>

                <StaticLink
                  to={`/instances/${(instance as WslInstance).parent.id}/${instance.id}`}
                >
                  {instance.title}
                </StaticLink>
              </>
            );
          } else {
            return (
              <>
                <CheckboxInput
                  inline
                  label={
                    <span className="u-off-screen">
                      Select {instance.title}
                    </span>
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
            );
          }
        },
      },
      {
        Header: "Compliance",
        Cell: ({ row: { original: instance } }: CellProps<Instance>) =>
          instance.is_wsl_instance ? <NoData /> : "Not compliant",
      },
      {
        Header: "OS",
        Cell: ({ row: { original: instance } }: CellProps<Instance>) =>
          instance.distribution_info?.description,
      },
      {
        Header: "WSL profiles",
        Cell: <NoData />,
      },
      {
        Header: "Last ping",
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => {
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
        className: classes.date,
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => {
          if (instance.is_wsl_instance) {
            return (
              <WslInstanceActions
                instance={instance as WslInstance}
                parentId={(instance as WslInstance).parent.id}
              />
            );
          } else {
            return (
              <WindowsInstanceActions instance={instance as WindowsInstance} />
            );
          }
        },
      },
    ],
    [instances, selectedInstances],
  );

  const clear = () => {
    setInputValue("");
    setSearch("");
  };

  return (
    <>
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
            value: search || undefined,
            clear,
          },
        ]}
      />

      {isGettingInstances ? (
        <LoadingState />
      ) : (
        <ResponsiveTable
          columns={columns}
          data={instances.flatMap((instance) => [
            instance,
            ...instance.children.map<WslInstance>((child) => ({
              ...(child as WslInstanceWithoutRelation),
              parent: instance as WindowsInstance,
              children: [],
            })),
          ])}
          emptyMsg="No Windows instances found according to your search parameters."
          minWidth={1200}
        />
      )}

      <WindowsInstanceMakeCompliantModal
        close={closeMakeCompliantModal}
        instances={selectedInstances as WindowsInstance[]}
        isOpen={isMakeCompliantModalOpen}
      />
    </>
  );
};

export default WslProfileNonCompliantInstancesList;
