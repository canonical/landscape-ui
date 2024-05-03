import { FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CellProps, Column } from "react-table";
import {
  Button,
  CheckboxInput,
  ModularTable,
} from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import { useWsl } from "@/hooks/useWsl";
import InstancesPanelHeader from "@/pages/dashboard/instances/[single]/tabs/instances/InstancesPanelHeader";
import { Instance, InstanceWithoutRelation } from "@/types/Instance";
import classes from "./InstancesPanel.module.scss";

interface InstancesPanelProps {
  instance: Instance;
}

const InstancesPanel: FC<InstancesPanelProps> = ({ instance }) => {
  const [selectedInstances, setSelectedInstances] = useState<
    InstanceWithoutRelation[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setDefaultChildInstanceQuery, deleteChildInstancesQuery } = useWsl();

  const wslInstances = useMemo(() => {
    if (!searchQuery) {
      return instance.children;
    }

    return instance.children.filter(
      ({ title, hostname }) =>
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostname.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [instance, searchQuery]);

  const { mutateAsync: setDefaultChildInstance } = setDefaultChildInstanceQuery;
  const { mutateAsync: deleteChildInstances } = deleteChildInstancesQuery;

  const handleSetDefaultChildInstance = async (child_id: number) => {
    try {
      await setDefaultChildInstance({
        child_id,
        parent_id: instance.id,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleSetDefaultChildInstanceDialog = (
    childInstance: InstanceWithoutRelation,
  ) => {
    confirmModal({
      title: "Set default instance",
      body: `Are you sure you want to set ${childInstance.title} as default instance?`,
      buttons: [
        <Button
          key="set-default"
          appearance="positive"
          onClick={() => handleSetDefaultChildInstance(childInstance.id)}
        >
          Set default
        </Button>,
      ],
    });
  };

  const handleDeleteChildInstances = async (instanceId: number) => {
    try {
      await deleteChildInstances({
        computer_ids: [instanceId],
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleDeleteChildInstancesDialog = (
    childInstance: InstanceWithoutRelation,
  ) => {
    confirmModal({
      title: `Delete ${childInstance.title}`,
      body: "This will remove the WSL instance from the host and Landscape",
      buttons: [
        <Button
          key="delete"
          appearance="negative"
          onClick={() => handleDeleteChildInstances(childInstance.id)}
        >
          Delete
        </Button>,
      ],
    });
  };

  const handleInstanceCheck = (instance: InstanceWithoutRelation) => {
    setSelectedInstances((prevState) =>
      prevState.some(({ id }) => id === instance.id)
        ? prevState.filter(({ id }) => id !== instance.id)
        : [...prevState, instance],
    );
  };

  const columns = useMemo<Column<InstanceWithoutRelation>[]>(
    () => [
      {
        accessor: "title",
        Header: (
          <>
            <CheckboxInput
              inline
              label={<span className="u-off-screen">Toggle all instances</span>}
              checked={
                wslInstances.length > 0 &&
                selectedInstances.length === wslInstances.length
              }
              indeterminate={
                selectedInstances.length > 0 &&
                selectedInstances.length < wslInstances.length
              }
              onChange={() => {
                setSelectedInstances(
                  selectedInstances.length > 0 ? [] : wslInstances,
                );
              }}
            />
            <span>Title</span>
          </>
        ),
        Cell: ({ row }: CellProps<InstanceWithoutRelation>) => (
          <div className={classes.title}>
            <CheckboxInput
              label={
                <span className="u-off-screen">{`Toggle ${row.original.title} instance`}</span>
              }
              labelClassName="u-no-margin--bottom u-no-padding--top"
              checked={selectedInstances.some(
                ({ id }) => id === row.original.id,
              )}
              onChange={() => handleInstanceCheck(row.original)}
            />
            <Link
              to={`${ROOT_PATH}instances/${instance.id}/${row.original.id}`}
            >
              {row.original.title}
            </Link>
          </div>
        ),
      },
      {
        accessor: "distribution",
        Header: "OS",
        Cell: ({ row: { original } }: CellProps<InstanceWithoutRelation>) =>
          original.distribution
            ? `Ubuntu\xA0${original.distribution}`
            : "Unknown",
      },
      {
        accessor: "default",
        Header: "Default",
        Cell: ({ row }: CellProps<InstanceWithoutRelation>) => (
          <span>
            {row.original.title === instance.default_child ? "Yes" : "No"}
          </span>
        ),
      },
      {
        accessor: "actions",
        className: classes.actions,
        Cell: ({ row }: CellProps<InstanceWithoutRelation>) => (
          <div className="divided-blocks">
            <div className="divided-blocks__item">
              <Button
                small
                hasIcon
                type="button"
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-right"
                aria-label={`Set ${row.original.title} as default instance`}
                onClick={() =>
                  handleSetDefaultChildInstanceDialog(row.original)
                }
              >
                <span className="p-tooltip__message">Set default instance</span>
                <i className="p-icon--pin u-no-margin--left" />
              </Button>
            </div>
            <div className="divided-blocks__item">
              <Button
                small
                hasIcon
                type="button"
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-right"
                aria-label={`Delete ${row.original.title} instance`}
                onClick={() => handleDeleteChildInstancesDialog(row.original)}
              >
                <span className="p-tooltip__message">Delete instance</span>
                <i className="p-icon--delete u-no-margin--left" />
              </Button>
            </div>
          </div>
        ),
      },
    ],
    [wslInstances, selectedInstances],
  );

  return (
    <>
      <InstancesPanelHeader
        parentId={instance.id}
        resetQuery={() => {
          setSearchQuery("");
        }}
        selectedInstances={selectedInstances}
        setQuery={(newQuery) => {
          setSearchQuery(newQuery);
        }}
      />
      <ModularTable columns={columns} data={wslInstances} />
    </>
  );
};

export default InstancesPanel;
