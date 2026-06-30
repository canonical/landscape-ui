import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { useProcesses } from "../../hooks";
import type { UrlParams } from "@/types/UrlParams";
import { ActionButton } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useParams } from "react-router";
import classes from "./ProcessesHeader.module.scss";
import { pluralize } from "@/utils/_helpers";

interface ProcessesHeaderProps {
  readonly handleClearSelection: () => void;
  readonly selectedPids: number[];
}

const ProcessesHeader: FC<ProcessesHeaderProps> = ({
  selectedPids,
  handleClearSelection,
}) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const { notify } = useNotify();
  const debug = useDebug();
  const { killProcessQuery, terminateProcessQuery } = useProcesses();

  const instanceId = Number(urlInstanceId);
  const { mutateAsync: terminateProcess, isPending: isTerminatingProcess } =
    terminateProcessQuery;
  const { mutateAsync: killProcess, isPending: isKillingProcess } =
    killProcessQuery;

  const handleEndProcess = async () => {
    try {
      await terminateProcess({
        pids: selectedPids,
        computer_id: instanceId,
      });
      notify.success({
        message: `${pluralize(selectedPids.length, ["Process", "Processes"])} successfully ended.`,
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
        message: `${pluralize(selectedPids.length, ["Process", "Processes"])} successfully killed.`,
      });
      handleClearSelection();
    } catch (error) {
      debug(error);
    }
  };

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classNames("p-segmented-control", classes.actions)}>
            <div className="p-segmented-control__list">
              <ActionButton
                type="button"
                className="p-segmented-control__button u-no-margin--bottom"
                disabled={0 === selectedPids.length}
                onClick={handleEndProcess}
                loading={isTerminatingProcess}
              >
                End process
              </ActionButton>
              <ActionButton
                type="button"
                className="p-segmented-control__button u-no-margin--bottom"
                disabled={0 === selectedPids.length}
                onClick={handleKillProcess}
                loading={isKillingProcess}
              >
                Kill process
              </ActionButton>
            </div>
          </div>
        }
        afterSearch={handleClearSelection}
      />
    </>
  );
};

export default ProcessesHeader;
