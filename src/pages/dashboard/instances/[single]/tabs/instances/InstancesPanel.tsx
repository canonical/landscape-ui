import { FC, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useInstances from "@/hooks/useInstances";
import useDebug from "@/hooks/useDebug";
import { CellProps, Column } from "react-table";
import { InstanceWithoutRelation } from "@/types/Instance";
import {
  Button,
  CheckboxInput,
  ModularTable,
} from "@canonical/react-components";
import classes from "./InstancesPanel.module.scss";
import InstancesPanelHeader from "./InstancesPanelHeader";
import LoadingState from "@/components/layout/LoadingState";
import { useWsl } from "@/hooks/useWsl";
import useConfirm from "@/hooks/useConfirm";
import { ROOT_PATH } from "@/constants";

const InstancesPanel: FC = () => {
  const [selectedInstances, setSelectedInstances] = useState<
    InstanceWithoutRelation[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { hostname } = useParams();
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { getInstancesQuery } = useInstances();
  const { setDefaultChildInstanceQuery, deleteChildInstancesQuery } = useWsl();

  const {
    data: getInstancesQueryResult,
    error: getInstancesQueryError,
    isLoading: getInstancesQueryLoading,
  } = getInstancesQuery({
    query: `hostname:${hostname}`,
  });

  if (getInstancesQueryError) {
    debug(getInstancesQueryError);
  }

  const wslInstances = useMemo(() => {
    if (!searchQuery) {
      return getInstancesQueryResult?.data.results[0].children ?? [];
    }

    return (
      getInstancesQueryResult?.data.results[0].children.filter(
        ({ title, hostname }) =>
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hostname.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ?? []
    );
  }, [getInstancesQueryResult, searchQuery]);

  const {
    mutateAsync: setDefaultChildInstance,
    isLoading: setDefaultChildInstanceQueryLoading,
  } = setDefaultChildInstanceQuery;
  const {
    mutateAsync: deleteChildInstances,
    isLoading: deleteChildInstancesQueryLoading,
  } = deleteChildInstancesQuery;

  const handleSetDefaultChildInstance = async (child_id: number) => {
    if (!getInstancesQueryResult) {
      return;
    }

    try {
      await setDefaultChildInstance({
        child_id,
        parent_id: getInstancesQueryResult.data.results[0].id,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleSetDefaultChildInstanceDialog = (
    instance: InstanceWithoutRelation,
  ) => {
    confirmModal({
      title: "Set default instance",
      body: `Are you sure you want to set ${instance.title} as default instance?`,
      buttons: [
        <Button
          key="set-default"
          appearance="positive"
          disabled={setDefaultChildInstanceQueryLoading}
          onClick={() => handleSetDefaultChildInstance(instance.id)}
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
    instance: InstanceWithoutRelation,
  ) => {
    confirmModal({
      title: `Delete ${instance.title}`,
      body: "This will remove the WSL instance from the host and Landscape",
      buttons: [
        <Button
          key="delete"
          appearance="negative"
          disabled={deleteChildInstancesQueryLoading}
          onClick={() => handleDeleteChildInstances(instance.id)}
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
              to={`${ROOT_PATH}instances/${hostname}/${row.original.hostname}`}
            >
              {row.original.title}
            </Link>
          </div>
        ),
      },
      {
        accessor: "distribution",
        Header: "OS",
        Cell: ({ row }: CellProps<InstanceWithoutRelation>) =>
          `Ubuntu\xA0${row.original.distribution}`,
      },
      {
        accessor: "default",
        Header: "Default",
        Cell: ({ row }: CellProps<InstanceWithoutRelation>) => (
          <span>{row.original.default ? "Yes" : "No"}</span>
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

  return getInstancesQueryResult ? (
    <>
      <InstancesPanelHeader
        parentId={getInstancesQueryResult?.data.results[0].id}
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
  ) : (
    getInstancesQueryLoading && <LoadingState />
  );
};

export default InstancesPanel;
