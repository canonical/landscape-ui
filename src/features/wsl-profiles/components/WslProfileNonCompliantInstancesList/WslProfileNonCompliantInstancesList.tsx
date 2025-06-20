import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import StaticLink from "@/components/layout/StaticLink";
import { WindowsInstanceMakeCompliantModal } from "@/features/wsl";
import useSelection from "@/hooks/useSelection";
import { type Instance } from "@/types/Instance";
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

const WslProfileNonCompliantInstancesList: FC = () => {
  const {
    value: isMakeCompliantModalOpen,
    setTrue: openMakeCompliantModal,
    setFalse: closeMakeCompliantModal,
  } = useBoolean();

  const [instances] = useState([]);

  const { selectedItems: selectedInstances } = useSelection(instances, true);

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
        Cell: ({ row: { original: instance } }: CellProps<Instance>) => (
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
        ),
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
