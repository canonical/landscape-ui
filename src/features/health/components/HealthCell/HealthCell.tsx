import useSidePanel from "@/hooks/useSidePanel";
import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
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
const HealthDetailsPanel = lazy(
  async () => import("../HealthDetailsPanel"),
);

interface HealthCellProps {
  readonly instance: Pick<
    Instance | InstanceWithoutRelation,
    "id" | "title" | "hostname" | "distribution_info" | "is_wsl_instance"
  >;
}

const HealthCell: FC<HealthCellProps> = ({ instance }) => {
  const measurable = isHealthMeasurable(instance);
  const { data, isLoading, isError } = useComputerHealth(
    measurable ? instance.id : 0,
  );
  const { setSidePanelContent } = useSidePanel();
  const health = data?.data;

  if (!measurable) {
    return (
      <span
        className={classes.notMeasurable}
        title="Health is only measured on Ubuntu instances running the Landscape client."
        aria-label="Health not measured: this instance does not run the Landscape client."
      >
        <HealthBar notMeasurable />
      </span>
    );
  }

  const canOpen = Boolean(health) && !isLoading && !isError;

  return (
    <button
      type="button"
      className={classes.trigger}
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
      <HealthBar
        health={health}
        isLoading={isLoading}
        isError={isError}
      />
    </button>
  );
};

export default HealthCell;
