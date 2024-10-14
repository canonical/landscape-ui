import { FC } from "react";
import useDebug from "@/hooks/useDebug";
import { useProcesses } from "@/hooks/useProcesses";
import { Button } from "@canonical/react-components";
import classes from "./ProcessesHeader.module.scss";
import useNotify from "@/hooks/useNotify";
import { usePageParams } from "@/hooks/usePageParams";
import { useParams } from "react-router-dom";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import classNames from "classnames";
import { UrlParams } from "@/types/UrlParams";

interface ProcessesHeaderProps {
  handleClearSelection: () => void;
  selectedPids: number[];
}

const ProcessesHeader: FC<ProcessesHeaderProps> = ({
  selectedPids,
  handleClearSelection,
}) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const { setPageParams } = usePageParams();
  const { notify } = useNotify();
  const debug = useDebug();
  const { killProcessQuery, terminateProcessQuery } = useProcesses();

  const instanceId = Number(urlInstanceId);
  const { mutateAsync: terminateProcess } = terminateProcessQuery;
  const { mutateAsync: killProcess } = killProcessQuery;

  const handleSearch = (searchText: string) => {
    setPageParams({
      search: searchText,
    });
    handleClearSelection();
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
    <HeaderWithSearch
      onSearch={handleSearch}
      actions={
        <div className={classNames("p-segmented-control", classes.actions)}>
          <div className="p-segmented-control__list">
            <Button
              type="button"
              className="p-segmented-control__button"
              disabled={0 === selectedPids.length}
              onClick={handleEndProcess}
            >
              End process
            </Button>
            <Button
              type="button"
              className="p-segmented-control__button"
              disabled={0 === selectedPids.length}
              onClick={handleKillProcess}
            >
              Kill process
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default ProcessesHeader;
