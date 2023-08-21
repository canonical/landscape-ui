import { FC, useState } from "react";
import PageMain from "../../../components/layout/PageMain";
import PageHeader from "../../../components/layout/PageHeader";
import PageContent from "../../../components/layout/PageContent";
import MachinesContainer from "./MachinesContainer";
import { SearchAndFilterChip } from "@canonical/react-components/dist/components/SearchAndFilter/types";
import { searchAndFilterData } from "../../../data/machines";
import { Button, Icon } from "@canonical/react-components";
import useDebug from "../../../hooks/useDebug";
import useComputers from "../../../hooks/useComputers";
import useConfirm from "../../../hooks/useConfirm";
import useScripts from "../../../hooks/useScripts";
import useAuth from "../../../hooks/useAuth";

const MachinesPage: FC = () => {
  const [visualTitle, setVisualTitle] = useState("");
  const [searchAndFilterChips, setSearchAndFilterChips] = useState<
    SearchAndFilterChip[]
  >([]);
  const [selected, setSelected] = useState<number[]>([]);

  const debug = useDebug();
  const { user } = useAuth();

  const { confirmModal, closeConfirmModal } = useConfirm();

  const { rebootComputersQuery, removeComputersQuery, shutdownComputersQuery } =
    useComputers();
  const { executeScriptQuery } = useScripts();

  const { mutateAsync: rebootComputers, isLoading: rebootComputersLoading } =
    rebootComputersQuery;
  const { mutateAsync: removeComputers, isLoading: removeComputersLoading } =
    removeComputersQuery;
  const {
    mutateAsync: shutdownComputers,
    isLoading: shutdownComputersLoading,
  } = shutdownComputersQuery;

  const { mutateAsync: executeScript } = executeScriptQuery;

  const handleRunScript = async () => {
    confirmModal({
      title: "Choose script to run on selected machines",
      body: `Choose a script to run on the selected machine${
        1 === selected.length ? "" : "s"
      }`,
      buttons: [
        <Button
          key="run"
          appearance="positive"
          onClick={async () => {
            try {
              await executeScript({
                query: `id:${selected.join(",")}`,
                username: user?.name ?? "",
                script_id: 1,
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Run script
        </Button>,
      ],
    });
  };

  const handleShutdownComputer = async () => {
    confirmModal({
      title: "Shutting down selected machines",
      body: `Are you sure you want to shutdown ${selected.length} machine${
        selected.length > 1 ? "s" : ""
      }?`,
      buttons: [
        <Button
          key="shutdown"
          appearance="negative"
          onClick={async () => {
            try {
              await shutdownComputers({
                computer_ids: selected,
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
      title: "Rebooting selected machines",
      body: `Are you sure you want to reboot ${selected.length} machine${
        selected.length > 1 ? "s" : ""
      }?`,
      buttons: [
        <Button
          key="reboot"
          appearance="brand"
          onClick={async () => {
            try {
              await rebootComputers({
                computer_ids: selected,
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Reboot
        </Button>,
      ],
    });
  };

  const handleRemoveComputer = async () => {
    confirmModal({
      title: "Removing selected machines",
      body: `Are you sure you want to remove ${selected.length} machine${
        selected.length > 1 ? "s" : ""
      }?`,
      buttons: [
        <Button
          key="remove"
          appearance="negative"
          onClick={async () => {
            try {
              await removeComputers({
                computer_ids: selected,
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Remove
        </Button>,
      ],
    });
  };

  return (
    <PageMain>
      <PageHeader
        title="Machines"
        hideTitle
        visualTitle={visualTitle}
        search={{
          filterPanelData: searchAndFilterData,
          returnSearchData: setSearchAndFilterChips,
        }}
        actions={[
          <div key="buttons" className="p-segmented-control">
            <div className="p-segmented-control__list">
              <button
                className="p-segmented-control__button"
                type="button"
                onClick={handleRunScript}
                disabled={0 === selected.length}
              >
                <Icon name="code" />
                <span>Run script</span>
              </button>
              <button
                className="p-segmented-control__button"
                type="button"
                onClick={handleShutdownComputer}
                disabled={shutdownComputersLoading || 0 === selected.length}
              >
                <Icon name="power-off" />
                <span>Shutdown</span>
              </button>
              <button
                className="p-segmented-control__button"
                type="button"
                onClick={handleRebootComputer}
                disabled={rebootComputersLoading || 0 === selected.length}
              >
                <Icon name="restart" />
                <span>Restart</span>
              </button>
              <button
                className="p-segmented-control__button"
                type="button"
                onClick={handleRemoveComputer}
                disabled={removeComputersLoading || 0 === selected.length}
              >
                <Icon name="delete" />
                <span>Remove</span>
              </button>
            </div>
          </div>,
        ]}
      />
      <PageContent>
        <MachinesContainer
          searchAndFilterChips={searchAndFilterChips}
          setVisualTitle={setVisualTitle}
          selectedIds={selected}
          setSelectedIds={setSelected}
        />
      </PageContent>
    </PageMain>
  );
};

export default MachinesPage;
