import { FC, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useComputers from "../../../../../../hooks/useComputers";
import useDebug from "../../../../../../hooks/useDebug";
import { CellProps, Column } from "react-table";
import { ComputerWithoutRelation } from "../../../../../../types/Computer";
import {
  Button,
  CheckboxInput,
  ModularTable,
} from "@canonical/react-components";
import classes from "./InstancesPanel.module.scss";
import InstancesPanelHeader from "./InstancesPanelHeader";
import LoadingState from "../../../../../../components/layout/LoadingState";
import { useWsl } from "../../../../../../hooks/useWsl";
import useConfirm from "../../../../../../hooks/useConfirm";
import { ROOT_PATH } from "../../../../../../constants";

const InstancesPanel: FC = () => {
  const [selectedComputers, setSelectedComputers] = useState<
    ComputerWithoutRelation[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { hostname } = useParams();
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { getComputersQuery } = useComputers();
  const { setDefaultChildComputerQuery, deleteChildComputersQuery } = useWsl();

  const {
    data: getComputersQueryResult,
    error: getComputersQueryError,
    isLoading: getComputersQueryLoading,
  } = getComputersQuery({
    query: `hostname:${hostname}`,
  });

  if (getComputersQueryError) {
    debug(getComputersQueryError);
  }

  const wslInstances = useMemo(() => {
    if (!searchQuery) {
      return getComputersQueryResult?.data.results[0].children ?? [];
    }

    return (
      getComputersQueryResult?.data.results[0].children.filter(
        ({ title, hostname }) =>
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hostname.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ?? []
    );
  }, [getComputersQueryResult, searchQuery]);

  const {
    mutateAsync: setDefaultChildComputer,
    isLoading: setDefaultChildComputerQueryLoading,
  } = setDefaultChildComputerQuery;
  const {
    mutateAsync: deleteChildComputers,
    isLoading: deleteChildComputersQueryLoading,
  } = deleteChildComputersQuery;

  const handleSetDefaultChildComputer = async (
    instance: ComputerWithoutRelation,
  ) => {
    if (!getComputersQueryResult) {
      return;
    }

    confirmModal({
      title: "Set default instance",
      body: `Are you sure you want to set ${instance.title} as default instance?`,
      buttons: [
        <Button
          key="set-default"
          appearance="positive"
          disabled={setDefaultChildComputerQueryLoading}
          onClick={async () => {
            try {
              await setDefaultChildComputer({
                parent_id: getComputersQueryResult.data.results[0].id,
                child_id: instance.id,
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Set default
        </Button>,
      ],
    });
  };

  const handleDeleteChildComputers = async (
    instance: ComputerWithoutRelation,
  ) => {
    confirmModal({
      title: `Delete ${instance.title}`,
      body: `This will remove the WSL instance from the host and Landscape`,
      buttons: [
        <Button
          key="delete"
          appearance="negative"
          disabled={deleteChildComputersQueryLoading}
          onClick={async () => {
            try {
              await deleteChildComputers({
                computer_ids: [instance.id],
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Delete
        </Button>,
      ],
    });
  };

  const columns = useMemo<Column<ComputerWithoutRelation>[]>(
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
                selectedComputers.length === wslInstances.length
              }
              indeterminate={
                selectedComputers.length > 0 &&
                selectedComputers.length < wslInstances.length
              }
              onChange={() => {
                setSelectedComputers(
                  selectedComputers.length > 0 ? [] : wslInstances,
                );
              }}
            />
            <span>Title</span>
          </>
        ),
        Cell: ({ row }: CellProps<ComputerWithoutRelation>) => (
          <div className={classes.title}>
            <CheckboxInput
              label={
                <span className="u-off-screen">{`Toggle ${row.original.title} instance`}</span>
              }
              labelClassName="u-no-margin--bottom u-no-padding--top"
              checked={selectedComputers.some(
                ({ id }) => id === row.original.id,
              )}
              onChange={() => {
                setSelectedComputers((prevState) =>
                  prevState.some(({ id }) => id === row.original.id)
                    ? prevState.filter(({ id }) => id !== row.original.id)
                    : [...prevState, row.original],
                );
              }}
            />
            <Link
              to={`${ROOT_PATH}machines/${hostname}/${row.original.hostname}`}
            >
              {row.original.title}
            </Link>
          </div>
        ),
      },
      {
        accessor: "distribution",
        Header: "OS",
        Cell: ({ row }: CellProps<ComputerWithoutRelation>) =>
          `Ubuntu\xA0${row.original.distribution}`,
      },
      {
        accessor: "default",
        Header: "Default",
        Cell: ({ row }: CellProps<ComputerWithoutRelation>) => (
          <span>{row.original.default ? "Yes" : "No"}</span>
        ),
      },
      {
        accessor: "actions",
        className: classes.actions,
        Cell: ({ row }: CellProps<ComputerWithoutRelation>) => (
          <div className={classes.dividedBlocks}>
            <div className={classes.dividedBlock}>
              <Button
                small
                hasIcon
                type="button"
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-right"
                aria-label={`Set ${row.original.title} as default instance`}
                onClick={async () => {
                  await handleSetDefaultChildComputer(row.original);
                }}
              >
                <span className="p-tooltip__message">Set default instance</span>
                <i className="p-icon--pin u-no-margin--left" />
              </Button>
            </div>
            <div className={classes.dividedBlock}>
              <Button
                small
                hasIcon
                type="button"
                appearance="base"
                className="u-no-margin--bottom u-no-padding--left p-tooltip--btm-right"
                aria-label={`Delete ${row.original.title} instance`}
                onClick={async () => {
                  await handleDeleteChildComputers(row.original);
                }}
              >
                <span className="p-tooltip__message">Delete instance</span>
                <i className="p-icon--delete u-no-margin--left" />
              </Button>
            </div>
          </div>
        ),
      },
    ],
    [wslInstances, selectedComputers],
  );

  return getComputersQueryResult ? (
    <>
      <InstancesPanelHeader
        parentId={getComputersQueryResult?.data.results[0].id}
        resetQuery={() => {
          setSearchQuery("");
        }}
        selectedInstances={selectedComputers}
        setQuery={(newQuery) => {
          setSearchQuery(newQuery);
        }}
      />
      <ModularTable columns={columns} data={wslInstances} />
    </>
  ) : (
    getComputersQueryLoading && <LoadingState />
  );
};

export default InstancesPanel;
