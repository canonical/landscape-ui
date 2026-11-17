define("vs/editor/editor.worker", ["exports", "../initialize-BJOLaCxY"], (function(exports, initialize) {
  "use strict";
  self.onmessage = () => {
    if (!initialize.isWorkerInitialized()) {
      initialize.start(() => {
        return {};
      });
    }
  };
  exports.initialize = initialize.initialize;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
}));
