import { FC, SyntheticEvent, useState } from "react";
import { Button, Form, SearchBox } from "@canonical/react-components";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { useWsl } from "@/hooks/useWsl";
import InstallWslInstanceForm from "@/pages/dashboard/instances/[single]/tabs/instances/InstallWslInstanceForm";
import { InstanceWithoutRelation } from "@/types/Instance";
import classes from "./InstancesPanelHeader.module.scss";

interface InstancesPanelHeaderProps {
  parentId: number;
  resetQuery: () => void;
  selectedInstances: InstanceWithoutRelation[];
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
  const { deleteChildInstancesQuery } = useWsl();

  const { mutateAsync: deleteChildInstances } = deleteChildInstancesQuery;

  const handleDeleteChildInstances = async () => {
    try {
      await deleteChildInstances({
        computer_ids: selectedInstances.map(({ id }) => id),
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleDeleteChildInstancesDialog = () => {
    confirmModal({
      title: `Delete ${
        selectedInstances.length === 1
          ? selectedInstances[0].title
          : "selected instances"
      }`,
      body: `This will remove selected WSL ${
        selectedInstances.length === 1 ? "instance" : "instances"
      } from the host and Landscape`,
      buttons: [
        <Button
          key="uninstall"
          appearance="negative"
          onClick={handleDeleteChildInstances}
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
          onClick={handleDeleteChildInstancesDialog}
          disabled={selectedInstances.length === 0}
        >
          <span>Uninstall</span>
        </Button>
      </div>
    </div>
  );
};

export default InstancesPanelHeader;
