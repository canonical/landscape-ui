import { FC, SyntheticEvent, useState } from "react";
import useDebug from "@/hooks/useDebug";
import { useProcesses } from "@/hooks/useProcesses";
import { Button, Form, SearchBox } from "@canonical/react-components";
import classes from "./ProcessesHeader.module.scss";
import useNotify from "@/hooks/useNotify";
import { usePageParams } from "@/hooks/usePageParams";
import { useParams } from "react-router-dom";

interface ProcessesHeaderProps {
  handleClearSelection: () => void;
  selectedPids: number[];
}

const ProcessesHeader: FC<ProcessesHeaderProps> = ({
  selectedPids,
  handleClearSelection,
}) => {
  const { instanceId: urlInstanceId } = useParams();
  const { search, setPageParams } = usePageParams();
  const { notify } = useNotify();
  const debug = useDebug();
  const { killProcessQuery, terminateProcessQuery } = useProcesses();

  const [searchText, setSearchText] = useState(search);

  const instanceId = Number(urlInstanceId);
  const { mutateAsync: terminateProcess } = terminateProcessQuery;
  const { mutateAsync: killProcess } = killProcessQuery;

  const handleSearch = () => {
    setPageParams({
      search: searchText,
    });
    handleClearSelection();
  };

  const handleClear = () => {
    setPageParams({
      search: "",
    });
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    handleSearch();
  };

  const handleEndProcess = async () => {
    try {
      await terminateProcess({
        pids: selectedPids,
        computer_id: instanceId,
      });
      notify.success({
        message: `${selectedPids.length === 1 ? "Process" : "Processes"} successfully ended`,
      });
      handleClearSelection();
    } catch (error) {
      debug(error);
    }
  };

  const handleKillProcess = async () => {
    try {
      await killProcess({
        pids: selectedPids,
        computer_id: instanceId,
      });
      notify.success({
        message: `${selectedPids.length === 1 ? "Process" : "Processes"} successfully killed`,
      });
      handleClearSelection();
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <Form onSubmit={handleSubmit} noValidate>
          <SearchBox
            shouldRefocusAfterReset
            externallyControlled
            autocomplete="off"
            aria-label="Process search"
            value={searchText}
            onChange={(inputValue) => setSearchText(inputValue)}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </Form>
      </div>
      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            className="p-segmented-control__button"
            disabled={0 === selectedPids.length}
            onClick={handleEndProcess}
          >
            End process
          </Button>
          <Button
            className="p-segmented-control__button"
            disabled={0 === selectedPids.length}
            onClick={handleKillProcess}
          >
            Kill process
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProcessesHeader;
