import SidePanelTableFilterChips from "@/components/filter/TableFilterChips/components/SidePanelTableFilterChips";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { WindowsInstanceMakeCompliantModal } from "@/features/wsl";
import useSelection from "@/hooks/useSelection";
import type {
  Instance,
  WindowsInstanceWithoutRelation,
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
import classes from "./WslProfileNonCompliantInstancesList.module.scss";
import WindowsInstanceActions from "./components/WindowsInstanceActions";
import WslInstanceActions from "./components/WslInstanceActions";

const WslProfileNonCompliantInstancesList: FC = () => {
  const [instances] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  const { selectedItems: selectedInstances } = useSelection(instances, true);

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
                  label={
                    <span className="u-off-screen">
                      Select {instance.title}
                    </span>
                  }
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
      },
      {
        Header: "Actions",
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => {
          if (instance.is_wsl_instance) {
            return (
              <WslInstanceActions
                instance={instance as WslInstanceWithoutRelation}
                parentId={0}
              />
            );
          } else {
            return (
              <WindowsInstanceActions
                instance={instance as WindowsInstanceWithoutRelation}
              />
            );
          }
        },
      },
    ],
    [],
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

      <ResponsiveTable
        columns={columns}
        data={[]}
        emptyMsg="No instances found according to your search parameters."
      />

      <WindowsInstanceMakeCompliantModal
        close={closeMakeCompliantModal}
        instances={selectedInstances}
        isOpen={isMakeCompliantModalOpen}
      />
    </>
  );
};

export default WslProfileNonCompliantInstancesList;
