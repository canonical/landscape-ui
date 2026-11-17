Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const getDefaultExport = require('../../utils/get-default-export.js');
const constants = require('./constants.js');
const object = require('../../utils/object.js');
const clientSubscriptions = require('./client-subscriptions.js');

let onHttpClientRequestCreated;
function patchClientRequest(httpModule, options) {
  const proto = httpModule.ClientRequest?.prototype;
  if (typeof proto?._storeHeader !== "function") {
    return;
  }
  const subscriptions = clientSubscriptions.getHttpClientSubscriptions({
    ...options,
    http: httpModule
  });
  onHttpClientRequestCreated = subscriptions[constants.HTTP_ON_CLIENT_REQUEST];
  if (object.getOriginalFunction(proto._storeHeader)) {
    return;
  }
  const originalStoreHeader = proto._storeHeader;
  object.wrapMethod(proto, "_storeHeader", function patchedStoreHeader(...args) {
    try {
      onHttpClientRequestCreated({ request: this }, constants.HTTP_ON_CLIENT_REQUEST);
    } catch {
    }
    return originalStoreHeader.apply(this, args);
  });
}
function patchModule(httpModuleExport, options = {}) {
  const httpModule = getDefaultExport.getDefaultExport(httpModuleExport);
  patchClientRequest(httpModule, options);
  return httpModuleExport;
}
const patchHttpModuleClient = (httpModuleExport, options = {}) => patchModule(httpModuleExport, options);

exports.patchHttpModuleClient = patchHttpModuleClient;
//# sourceMappingURL=client-patch.js.map
