import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

loader.config({ monaco });

self.MonacoEnvironment = {
  getWorker: function (_workerId, label) {
    const getWorkerModule = (moduleUrl: string) => {
      return new Worker(new URL(moduleUrl, import.meta.url), {
        name: label,
        type: "module",
      });
    };

    switch (label) {
      case "json":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/json/json.worker?worker",
        );
      case "css":
      case "scss":
      case "less":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/css/css.worker?worker",
        );
      case "html":
      case "handlebars":
      case "razor":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/html/html.worker?worker",
        );
      case "typescript":
      case "javascript":
        return getWorkerModule(
          "/monaco-editor/esm/vs/language/typescript/ts.worker?worker",
        );
      default:
        return getWorkerModule(
          "/monaco-editor/esm/vs/editor/editor.worker?worker",
        );
    }
  },
};
