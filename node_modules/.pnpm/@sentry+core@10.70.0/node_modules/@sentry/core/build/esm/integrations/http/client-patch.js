import { getDefaultExport } from '../../utils/get-default-export.js';
import { HTTP_ON_CLIENT_REQUEST } from './constants.js';
import { getOriginalFunction, wrapMethod } from '../../utils/object.js';
import { getHttpClientSubscriptions } from './client-subscriptions.js';

let onHttpClientRequestCreated;
function patchClientRequest(httpModule, options) {
  const proto = httpModule.ClientRequest?.prototype;
  if (typeof proto?._storeHeader !== "function") {
    return;
  }
  const subscriptions = getHttpClientSubscriptions({
    ...options,
    http: httpModule
  });
  onHttpClientRequestCreated = subscriptions[HTTP_ON_CLIENT_REQUEST];
  if (getOriginalFunction(proto._storeHeader)) {
    return;
  }
  const originalStoreHeader = proto._storeHeader;
  wrapMethod(proto, "_storeHeader", function patchedStoreHeader(...args) {
    try {
      onHttpClientRequestCreated({ request: this }, HTTP_ON_CLIENT_REQUEST);
    } catch {
    }
    return originalStoreHeader.apply(this, args);
  });
}
function patchModule(httpModuleExport, options = {}) {
  const httpModule = getDefaultExport(httpModuleExport);
  patchClientRequest(httpModule, options);
  return httpModuleExport;
}
const patchHttpModuleClient = (httpModuleExport, options = {}) => patchModule(httpModuleExport, options);

export { patchHttpModuleClient };
//# sourceMappingURL=client-patch.js.map
