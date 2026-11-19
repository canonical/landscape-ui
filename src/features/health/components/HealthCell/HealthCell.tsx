import useSidePanel from "@/hooks/useSidePanel";
import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import { Button } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { Suspense, lazy } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { isHealthMeasurable } from "../../helpers";
import useComputerHealth from "../../hooks/useComputerHealth";
import HealthBar from "../HealthBar";
import classes from "./HealthCell.module.scss";

// Lazy-load the side panel content so the cell itself stays cheap to
// render across hundreds of rows. The panel only mounts when an
// operator actually opens it.
const HealthDetailsPanel = lazy(async () => import("../HealthDetailsPanel"));

interface HealthCellProps {
  readonly instance: Pick<
    Instance | InstanceWithoutRelation,
    | "id"
    | "title"
    | "hostname"
    | "distribution_info"
    | "is_wsl_instance"
    | "health"
  >;
}

const HealthCell: FC<HealthCellProps> = ({ instance }) => {
  const inline = instance.health;
  // Fall back to the per-id endpoint only when the list response didn't
  // include the inline object, which happens on detail pages where the list
  // query doesn't run.
  const canFetch = !inline && isHealthMeasurable(instance);
  const { data, isLoading, isError } = useComputerHealth(
    canFetch ? instance.id : 0,
  );
  const { setSidePanelContent } = useSidePanel();
  const state = inline ?? data?.data;
  const health = state?.measurable ? state : undefined;

  if (state?.measurable === false || (!inline && !canFetch)) {
    return (
      <span title="No health score. Health is measured on Ubuntu instances once they have reported their packages.">
        <HealthBar notMeasurable />
      </span>
    );
  }

  const canOpen = Boolean(health) && !isLoading && !isError;

  return (
    <Button
      type="button"
      appearance="base"
      className={classNames("u-no-margin--bottom", classes.trigger)}
      disabled={!canOpen}
      onClick={() => {
        setSidePanelContent(
          `Health · ${instance.title}`,
          <Suspense fallback={<LoadingState />}>
            <HealthDetailsPanel instance={instance} />
          </Suspense>,
          "medium",
        );
      }}
      aria-label={
        health
          ? `Open health details for ${instance.title}. Score ${health.score}.`
          : `Health for ${instance.title}`
      }
    >
      <HealthBar health={health} isLoading={isLoading} isError={isError} />
    </Button>
  );
};

export default HealthCell;
