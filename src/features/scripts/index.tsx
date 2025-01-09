import { ComponentProps, FC, lazy, Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";

const SingleScriptComponent = lazy(() => import("./components/SingleScript"));

export const SingleScript: FC<ComponentProps<typeof SingleScriptComponent>> = (
  props,
) => {
  return (
    <Suspense fallback={<LoadingState />}>
      <SingleScriptComponent {...props} />
    </Suspense>
  );
};

export { default as RunInstanceScriptForm } from "./components/RunInstanceScriptForm";
export { default as ScriptList } from "./components/ScriptList";
export { default as ScriptsEmptyState } from "./components/ScriptsEmptyState";
export { useScripts } from "./hooks";
export type { GetScriptCodeParams } from "./hooks";
