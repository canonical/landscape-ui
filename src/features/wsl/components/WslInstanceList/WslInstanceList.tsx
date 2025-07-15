import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import type { InstanceChild, WindowsInstance } from "@/types/Instance";
import { CheckboxInput } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import WslInstanceListActions from "../WslInstanceListActions";
import WslInstancesHeader from "../WslInstancesHeader";
import GroupHeader from "./components/GroupHeader";
import { getCompliance } from "./helpers";
import classes from "./WslInstanceList.module.scss";

interface WslInstanceListProps {
  readonly wslInstances: InstanceChild[];
  readonly windowsInstance: WindowsInstance;
}

interface WslInstanceListRow extends Record<string, unknown> {
  name: ReactNode;
  compliance?: ReactNode;
  complianceIcon?: string;
  os?: ReactNode;
  profile?: ReactNode;
  default?: ReactNode;
  actions?: ReactNode;
}

const WslInstanceList: FC<WslInstanceListProps> = ({
  wslInstances,
  windowsInstance,
}) => {
  const { groupBy, search } = usePageParams();

  const filteredWslInstances = useMemo(() => {
    if (!search) {
      return wslInstances;
    }

    return wslInstances.filter(({ name }) =>
      name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [wslInstances, search]);

  const {
    selectedItems: selectedWslInstances,
    setSelectedItems: setSelectedWslInstances,
  } = useSelection(filteredWslInstances);

  const handleInstanceCheck = (instance: InstanceChild) => {
    setSelectedWslInstances((prevState) =>
      prevState.some((i) => i === instance)
        ? prevState.filter((i) => i !== instance)
        : [...prevState, instance],
    );
  };

  const hasWslProfiles = wslInstances.some(
    (instanceChild) => instanceChild.profile,
  );

  const columns = useMemo<Column<WslInstanceListRow>[]>(
    () =>
      [
        {
          accessor: "name",
          Header: (
            <>
              <CheckboxInput
                inline
                label={
                  <span className="u-off-screen">Toggle all instances</span>
                }
                checked={
                  wslInstances.length > 0 &&
                  selectedWslInstances.length === wslInstances.length
                }
                indeterminate={
                  selectedWslInstances.length > 0 &&
                  selectedWslInstances.length < wslInstances.length
                }
                onChange={() => {
                  setSelectedWslInstances(
                    selectedWslInstances.length < wslInstances.length
                      ? wslInstances
                      : [],
                  );
                }}
              />
              <span>Instance name</span>
            </>
          ),
          Cell: ({ row: { original } }: CellProps<WslInstanceListRow>) =>
            original.name,
        },
        hasWslProfiles
          ? {
              Header: "Compliance",
              getCellIcon: ({
                row: { original },
              }: CellProps<WslInstanceListRow>) => original.complianceIcon,
              Cell: ({ row: { original } }: CellProps<WslInstanceListRow>) =>
                original.compliance,
            }
          : null,
        {
          accessor: "version_id",
          Header: "OS",
          Cell: ({ row: { original } }: CellProps<WslInstanceListRow>) =>
            original.os,
        },
        hasWslProfiles
          ? {
              Header: "WSL profile",
              Cell: ({ row: { original } }: CellProps<WslInstanceListRow>) =>
                original.profile,
            }
          : null,
        {
          Header: "Default",
          Cell: ({ row: { original } }: CellProps<WslInstanceListRow>) =>
            original.default,
        },
        {
          ...LIST_ACTIONS_COLUMN_PROPS,
          Cell: ({ row: { original } }: CellProps<WslInstanceListRow>) =>
            original.actions,
        },
      ].filter((column) => column !== null),
    [wslInstances, selectedWslInstances],
  );

  const createRow = (instances: InstanceChild[]) => {
    return instances.map((wslInstance) => ({
      type: "instance",
      name: (
        <div
          className={classNames(classes.title, { [classes.indented]: groupBy })}
        >
          <CheckboxInput
            label={
              <span className="u-off-screen">{`Toggle ${wslInstance.name} instance`}</span>
            }
            labelClassName="u-no-margin--bottom u-no-padding--top"
            checked={selectedWslInstances.some((i) => i === wslInstance)}
            onChange={() => {
              handleInstanceCheck(wslInstance);
            }}
          />

          {wslInstance.computer_id !== null ? (
            <StaticLink
              to={`/instances/${windowsInstance.id}/${wslInstance.computer_id}`}
            >
              {wslInstance.name}
            </StaticLink>
          ) : (
            wslInstance.name
          )}
        </div>
      ),
      compliance: getCompliance(wslInstance),
      complianceIcon:
        wslInstance.compliance === "compliant"
          ? "success-grey"
          : wslInstance.compliance
            ? "warning"
            : "",
      os: wslInstance.version_id || <NoData />,
      profile: wslInstance.profile || <NoData />,
      default:
        wslInstance.computer_id === null ? (
          <NoData />
        ) : wslInstance.default ? (
          "Yes"
        ) : (
          "No"
        ),
      registered: (
        <WslInstanceListActions
          windowsInstance={windowsInstance}
          wslInstance={wslInstance}
        />
      ),
      actions: (
        <WslInstanceListActions
          windowsInstance={windowsInstance}
          wslInstance={wslInstance}
        />
      ),
    }));
  };

  const noncompliantWslInstances = wslInstances.filter(
    (wslInstance) => wslInstance.compliance === "noncompliant",
  );

  const uninstalledWslInstances = wslInstances.filter(
    (wslInstance) => wslInstance.compliance === "uninstalled",
  );

  const compliantWslInstances = wslInstances.filter(
    (wslInstance) => wslInstance.compliance === "compliant",
  );

  const registeredWslInstances = wslInstances.filter(
    (wslInstance) => wslInstance.registered,
  );

  const unregisteredWslInstances = wslInstances.filter(
    (wslInstance) => wslInstance.compliance === "unregistered",
  );

  return (
    <>
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={selectedWslInstances}
        hasWslProfiles={hasWslProfiles}
      />

      <ResponsiveTable
        columns={columns}
        data={
          groupBy === "compliance"
            ? [
                {
                  name: (
                    <GroupHeader
                      label="Not compliant"
                      selectedWslInstances={selectedWslInstances}
                      setSelectedWslInstances={setSelectedWslInstances}
                      wslInstances={noncompliantWslInstances}
                    />
                  ),
                },
                ...createRow(noncompliantWslInstances),
                {
                  name: (
                    <GroupHeader
                      label="Not installed"
                      selectedWslInstances={selectedWslInstances}
                      setSelectedWslInstances={setSelectedWslInstances}
                      wslInstances={uninstalledWslInstances}
                    />
                  ),
                },
                ...createRow(uninstalledWslInstances),
                {
                  name: (
                    <GroupHeader
                      label="Compliant"
                      selectedWslInstances={selectedWslInstances}
                      setSelectedWslInstances={setSelectedWslInstances}
                      wslInstances={compliantWslInstances}
                    />
                  ),
                },
                ...createRow(compliantWslInstances),
                {
                  name: (
                    <GroupHeader
                      label="Created by Landscape"
                      selectedWslInstances={selectedWslInstances}
                      setSelectedWslInstances={setSelectedWslInstances}
                      wslInstances={registeredWslInstances}
                    />
                  ),
                },
                ...createRow(registeredWslInstances),
                {
                  name: (
                    <GroupHeader
                      label="Not created by Landscape"
                      selectedWslInstances={selectedWslInstances}
                      setSelectedWslInstances={setSelectedWslInstances}
                      wslInstances={unregisteredWslInstances}
                    />
                  ),
                },
                ...createRow(unregisteredWslInstances),
              ]
            : createRow(wslInstances)
        }
        emptyMsg="No WSL instances found according to your search parameters."
      />
    </>
  );
};

export default WslInstanceList;
