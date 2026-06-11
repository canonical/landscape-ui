import useSidePanel from "@/hooks/useSidePanel";
import type {
  Instance,
  InstanceHealth,
  InstanceWithoutRelation,
} from "@/types/Instance";
import type { FC } from "react";
import { Suspense, lazy } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { isHealthMeasurable } from "../../helpers";
import useComputerHealth from "../../hooks/useComputerHealth";
import type { ComputerHealth, HealthActionKind } from "../../types";
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
    | "id"
    | "title"
    | "hostname"
    | "distribution_info"
    | "is_wsl_instance"
    | "health"
  >;
}

// LA061 Phase 1.7: when the list endpoint passes `with_health=true`, each
// row carries `instance.health` inline. Adapt that to the shape HealthBar
// expects so the same component renders either source.
const toComputerHealth = (
  computer_id: number,
  inline: InstanceHealth,
): ComputerHealth => ({
  computer_id,
  // account_id isn't carried in the row-level snapshot — HealthBar doesn't
  // need it. Stub with 0; the side panel re-fetches the full record on open
  // and will get the real value back.
  account_id: 0,
  score: inline.score,
  band: inline.band,
  critical_factor_count: inline.critical_factor_count,
  factors: inline.factors,
  recommended_actions: inline.recommended_actions as HealthActionKind[],
  updated_at: inline.updated_at,
});

const HealthCell: FC<HealthCellProps> = ({ instance }) => {
  const measurable = isHealthMeasurable(instance);
  const inline = instance.health;
  // Fall back to the per-id endpoint only when the list response didn't
  // include the inline snapshot — relevant on detail pages where the list
  // query doesn't run.
  const { data, isLoading, isError } = useComputerHealth(
    measurable && !inline ? instance.id : 0,
  );
  const { setSidePanelContent } = useSidePanel();
  const health = inline ? toComputerHealth(instance.id, inline) : data?.data;

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
