import type { ComponentProps, FC } from "react";
import { lazy, Suspense } from "react";
import LoadingState from "../layout/LoadingState";

const CodeEditorInner = lazy(() => import("./CodeEditorInner"));

type CodeEditorProps = ComponentProps<typeof CodeEditorInner>;

const CodeEditor: FC<CodeEditorProps> = (props) => {
  return (
    <Suspense fallback={<LoadingState />}>
      <CodeEditorInner {...props} />
    </Suspense>
  );
};

export default CodeEditor;
