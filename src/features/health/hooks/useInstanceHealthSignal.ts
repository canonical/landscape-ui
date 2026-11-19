import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import useAuth from "@/hooks/useAuth";
import { isHealthMeasurable } from "../helpers";
import type { HealthBand } from "../types";
import useComputerHealth from "./useComputerHealth";

interface InstanceHealthSignal {
  score: number | undefined;
  band: HealthBand | undefined;
  isLoading: boolean;
}

// Thin wrapper that resolves the per-instance score for places that
// need it as a *signal* (tab badge, nav-bar dot, etc.) rather than a
// full breakdown. Returns undefined fields when health is disabled or
// the instance has no score so callers don't have to repeat the
// guard logic.
export default function useInstanceHealthSignal(
  instance: Pick<
    Instance | InstanceWithoutRelation,
    "id" | "distribution_info" | "is_wsl_instance"
  >,
): InstanceHealthSignal {
  const { isFeatureEnabled } = useAuth();
  const eligible = isFeatureEnabled("health") && isHealthMeasurable(instance);
  const query = useComputerHealth(eligible ? instance.id : 0);
  const data = eligible ? query.data?.data : undefined;
  const measured = data?.measurable ? data : undefined;
  return {
    score: measured?.score,
    band: measured?.band,
    isLoading: eligible && query.isLoading,
  };
}
