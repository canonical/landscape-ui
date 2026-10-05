import useAuth from "@/hooks/useAuth";

export default function useCanCancelOperations() {
  const { isFeatureEnabled } = useAuth();
  return isFeatureEnabled("persistent-lros");
}
