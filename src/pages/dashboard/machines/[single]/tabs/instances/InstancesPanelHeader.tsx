import { FC, SyntheticEvent, useState } from "react";
import { Button, Form, SearchBox } from "@canonical/react-components";
import useDebug from "../../../../../../hooks/useDebug";
import { useWsl } from "../../../../../../hooks/useWsl";
import classes from "./InstancesPanelHeader.module.scss";
import useSidePanel from "../../../../../../hooks/useSidePanel";
import useConfirm from "../../../../../../hooks/useConfirm";
import InstallWslInstanceForm from "./InstallWslInstanceForm";
import { ComputerWithoutRelation } from "../../../../../../types/Computer";

interface InstancesPanelHeaderProps {
  parentId: number;
  resetQuery: () => void;
  selectedInstances: ComputerWithoutRelation[];
  setQuery: (newQuery: string) => void;
}

const InstancesPanelHeader: FC<InstancesPanelHeaderProps> = ({
  parentId,
  resetQuery,
  selectedInstances,
  setQuery,
}) => {
  const [searchText, setSearchText] = useState("");

  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { deleteChildComputersQuery } = useWsl();

  const { mutateAsync: deleteChildComputers } = deleteChildComputersQuery;

  const handleDeleteChildComputers = async () => {
    confirmModal({
      title: `Delete ${
        selectedInstances.length > 1
          ? "selected instances"
          : selectedInstances[0].title
      }`,
      body: `This will remove selected WSL instance${
        selectedInstances.length > 1 ? "s" : ""
      } from the host and Landscape`,
      buttons: [
        <Button
          key="uninstall"
          appearance="negative"
          onClick={async () => {
            try {
              await deleteChildComputers({
                computer_ids: selectedInstances.map(({ id }) => id),
              });
            } catch (error) {
              debug(error);
            } finally {
              closeConfirmModal();
            }
          }}
        >
          Uninstall
        </Button>,
      ],
    });
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setQuery(searchText);
  };

  return (
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <Form onSubmit={handleSubmit} noValidate>
          <SearchBox
            onChange={(value) => setSearchText(value)}
            value={searchText}
            onSearch={() => setQuery(searchText)}
            autocomplete="off"
            onClear={() => {
              resetQuery();
              setSearchText("");
            }}
          />
        </Form>
      </div>

      <div className={classes.cta}>
        <Button
          type="button"
          onClick={() => {
            setSidePanelContent(
              "Install new WSL instance",
              <InstallWslInstanceForm parentId={parentId} />,
            );
          }}
        >
          <span>Install new instance</span>
        </Button>

        <Button
          type="button"
          onClick={handleDeleteChildComputers}
          disabled={selectedInstances.length === 0}
        >
          <span>Uninstall</span>
        </Button>
      </div>
    </div>
  );
};

export default InstancesPanelHeader;
