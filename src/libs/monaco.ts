import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

loader.config({ monaco });

const getWorkerModule = (moduleUrl: string, label: string) => {
  return new Worker(new URL(moduleUrl, import.meta.url), {
    name: label,
    type: "module",
  });
};

self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    switch (label) {
      case "json":
        return getWorkerModule(
          "monaco-editor/esm/vs/language/json/json.worker",
          label,
        );

      case "css":
      case "scss":
      case "less":
        return getWorkerModule(
          "monaco-editor/esm/vs/language/css/css.worker",
          label,
        );

      case "html":
      case "handlebars":
      case "razor":
        return getWorkerModule(
          "monaco-editor/esm/vs/language/html/html.worker",
          label,
        );

      case "typescript":
      case "javascript":
        return getWorkerModule(
          "monaco-editor/esm/vs/language/typescript/ts.worker",
          label,
        );

      default:
        return getWorkerModule(
          "monaco-editor/esm/vs/editor/editor.worker",
          label,
        );
    }
  },
};
