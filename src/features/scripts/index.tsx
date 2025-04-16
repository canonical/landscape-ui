import LoadingState from "@/components/layout/LoadingState";
import type { ComponentProps, FC } from "react";
import { lazy, Suspense } from "react";

const SingleScriptComponent = lazy(
  async () => import("./components/SingleScript"),
);

export const SingleScript: FC<ComponentProps<typeof SingleScriptComponent>> = (
  props,
) => {
  return (
    <Suspense fallback={<LoadingState />}>
      <SingleScriptComponent {...props} />
    </Suspense>
  );
};

export { useGetScripts, useGetSingleScript } from "./api";
export { default as RunInstanceScriptForm } from "./components/RunInstanceScriptForm";
export { default as ScriptList } from "./components/ScriptList";
export { default as ScriptsContainer } from "./components/ScriptsContainer";
export { default as ScriptsEmptyState } from "./components/ScriptsEmptyState";
export { default as ScriptsTabs } from "./components/ScriptsTabs";
export { useScripts } from "./hooks";
export type { CopyScriptParams, GetScriptCodeParams } from "./hooks";
export type { Script, ScriptStatus } from "./types";
