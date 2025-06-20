import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import StaticLink from "@/components/layout/StaticLink";
import { WindowsInstanceMakeCompliantModal } from "@/features/wsl";
import useSelection from "@/hooks/useSelection";
import type {
  InstanceWithoutRelation,
  WindowsInstanceWithoutRelation,
  WslInstanceWithoutRelation,
} from "@/types/Instance";
import {
  Button,
  CheckboxInput,
  Icon,
  ModularTable,
} from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { useBoolean } from "usehooks-ts";
import classes from "./WslProfileNonCompliantInstancesList.module.scss";
import WindowsInstanceActions from "./components/WindowsInstanceActions";
import WslInstanceActions from "./components/WslInstanceActions";

const WslProfileNonCompliantInstancesList: FC = () => {
  const [instances] = useState([]);

  const { selectedItems: selectedInstances } = useSelection(instances, true);

  const {
    value: isMakeCompliantModalOpen,
    setTrue: openMakeCompliantModal,
    setFalse: closeMakeCompliantModal,
  } = useBoolean();

  const columns = useMemo<Column<InstanceWithoutRelation>[]>(
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
        Cell: ({
          row: { original: instance },
        }: CellProps<InstanceWithoutRelation>) => {
          return (
            <>
              <CheckboxInput
                label={
                  <span className="u-off-screen">Select {instance.title}</span>
                }
              />

              <StaticLink to={`/instances/${instance.id}`}>
                {instance.title}
              </StaticLink>
            </>
          );
        },
      },
      {
        Header: "Compliance",
      },
      {
        Header: "OS",
      },
      {
        Header: "Profiles",
      },
      {
        Header: "Last ping",
      },
      {
        Header: "Actions",
        Cell: ({
          row: { original: instance },
        }: CellProps<InstanceWithoutRelation>) => {
          if (instance.is_wsl_instance) {
            return (
              <WslInstanceActions
                instance={instance as WslInstanceWithoutRelation}
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

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.header}>
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
        }
      />

      <ModularTable columns={columns} data={[]} />

      <WindowsInstanceMakeCompliantModal
        close={closeMakeCompliantModal}
        instances={selectedInstances}
        isOpen={isMakeCompliantModalOpen}
      />
    </>
  );
};

export default WslProfileNonCompliantInstancesList;
