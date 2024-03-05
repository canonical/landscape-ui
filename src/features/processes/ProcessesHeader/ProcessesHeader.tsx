import { FC, useState } from "react";
import useDebug from "@/hooks/useDebug";
import { useProcesses } from "@/hooks/useProcesses";
import { Button, Form, SearchBox } from "@canonical/react-components";
import classes from "./ProcessesHeader.module.scss";
import useNotify from "@/hooks/useNotify";

interface ProcessesHeaderProps {
  instanceId: number;
  onPageChange: (page: number) => void;
  onSearch: (searchText: string) => void;
  selectedPids: number[];
  setSelectedPids: (pids: number[]) => void;
}

const ProcessesHeader: FC<ProcessesHeaderProps> = ({
  instanceId,
  onPageChange,
  onSearch,
  selectedPids,
  setSelectedPids,
}) => {
  const [inputText, setInputText] = useState("");

  const { notify } = useNotify();
  const debug = useDebug();
  const { killProcessQuery, terminateProcessQuery } = useProcesses();
  const { mutateAsync: terminateProcess } = terminateProcessQuery;
  const { mutateAsync: killProcess } = killProcessQuery;

  const handleSearch = (searchText = inputText) => {
    onSearch(searchText);
    onPageChange(1);
  };

  const handleClearSearchBox = () => {
    setInputText("");
    handleSearch("");
  };

  const handleEndProcess = async () => {
    try {
      await terminateProcess({
        pids: selectedPids,
        computer_id: instanceId,
      });
      notify.success({
        message: `Process${selectedPids.length > 1 ? "es" : ""} successfully ended`,
      });
      setSelectedPids([]);
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
        message: `Process${selectedPids.length > 1 ? "es" : ""} successfully killed`,
      });
      setSelectedPids([]);
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
          noValidate
        >
          <SearchBox
            externallyControlled
            shouldRefocusAfterReset
            aria-label="Process search"
            onChange={(inputValue) => {
              setInputText(inputValue);
            }}
            value={inputText}
            onSearch={handleSearch}
            onClear={handleClearSearchBox}
            autocomplete="off"
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
