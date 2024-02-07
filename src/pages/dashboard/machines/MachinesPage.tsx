import { FC, lazy, Suspense, useState } from "react";
import PageMain from "../../../components/layout/PageMain";
import PageHeader from "../../../components/layout/PageHeader";
import PageContent from "../../../components/layout/PageContent";
import MachinesContainer from "./MachinesContainer";
import { Button, Icon } from "@canonical/react-components";
import useDebug from "../../../hooks/useDebug";
import useComputers from "../../../hooks/useComputers";
import useConfirm from "../../../hooks/useConfirm";
import classes from "./MachinesPage.module.scss";
import useSidePanel from "../../../hooks/useSidePanel";
import { Computer } from "../../../types/Computer";
import LoadingState from "../../../components/layout/LoadingState";
import MachinesUpgrades from "./MachinesUpgrades";

const RunScriptForm = lazy(() => import("./RunScriptForm"));

const MachinesPage: FC = () => {
  const [selected, setSelected] = useState<Computer[]>([]);

  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { confirmModal, closeConfirmModal } = useConfirm();

  const { rebootComputersQuery, shutdownComputersQuery } = useComputers();

  const { mutateAsync: rebootComputers, isLoading: rebootComputersLoading } =
    rebootComputersQuery;
  const {
    mutateAsync: shutdownComputers,
    isLoading: shutdownComputersLoading,
  } = shutdownComputersQuery;

  const handleRunScript = async () => {
    setSidePanelContent(
      "Run script",
      <Suspense fallback={<LoadingState />}>
        <RunScriptForm
          query={`id:${selected.map(({ id }) => id).join(" id:")}`}
        />
      </Suspense>,
    );
  };

  const handleShutdownComputer = async () => {
    confirmModal({
      title: "Shutting down selected instances",
      body: `Are you sure you want to shutdown ${selected.length} instance${
        selected.length > 1 ? "s" : ""
      }?`,
      buttons: [
        <Button
          key="shutdown"
          appearance="negative"
          onClick={async () => {
            try {
              await shutdownComputers({
                computer_ids: selected.map(({ id }) => id),
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Shutdown
        </Button>,
      ],
    });
  };

  const handleRebootComputer = async () => {
    confirmModal({
      title: "Restarting selected instances",
      body: `Are you sure you want to restart ${selected.length} instance${
        selected.length > 1 ? "s" : ""
      }?`,
      buttons: [
        <Button
          key="restart"
          appearance="negative"
          onClick={async () => {
            try {
              await rebootComputers({
                computer_ids: selected.map(({ id }) => id),
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Restart
        </Button>,
      ],
    });
  };

  const handleUpgradesRequest = () => {
    setSidePanelContent(
      "Upgrades",
      <MachinesUpgrades selectedMachines={selected} />,
      true,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        className={classes.header}
        actions={[
          <div key="buttons" className="p-segmented-control">
            <div className="p-segmented-control__list">
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleRebootComputer}
                disabled={rebootComputersLoading || 0 === selected.length}
              >
                <Icon name="restart" />
                <span>Restart</span>
              </Button>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleShutdownComputer}
                disabled={shutdownComputersLoading || 0 === selected.length}
              >
                <Icon name="power-off" />
                <span>Shutdown</span>
              </Button>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleRunScript}
                disabled={0 === selected.length}
              >
                <Icon name="code" />
                <span>Run script</span>
              </Button>
              <Button
                className="p-segmented-control__button"
                type="button"
                onClick={handleUpgradesRequest}
                disabled={0 === selected.length}
              >
                <Icon name="begin-downloading" />
                <span>Request upgrades</span>
              </Button>
            </div>
          </div>,
        ]}
      />
      <PageContent>
        <MachinesContainer
          selectedMachines={selected}
          setSelectedMachines={(machines) => {
            setSelected(machines);
          }}
        />
      </PageContent>
    </PageMain>
  );
};

export default MachinesPage;
