import { defaultPiiToCollectionOptions } from './defaultPiiToCollectionOptions.js';

const DEFAULTS = {
  userInfo: true,
  cookies: true,
  httpHeaders: { request: true, response: true },
  httpBodies: ["incomingRequest", "outgoingRequest", "incomingResponse", "outgoingResponse"],
  urlQueryParams: true,
  graphQL: { document: true, variables: true },
  genAI: { inputs: true, outputs: true },
  databaseQueryData: true,
  stackFrameVariables: true,
  frameContextLines: 5
};
function resolveDataCollectionOptions(options) {
  const base = options.dataCollection != null ? DEFAULTS : defaultPiiToCollectionOptions(options.sendDefaultPii);
  const dc = options.dataCollection ?? {};
  return {
    userInfo: dc.userInfo ?? base.userInfo,
    cookies: dc.cookies ?? base.cookies,
    httpHeaders: {
      request: dc.httpHeaders?.request ?? base.httpHeaders.request,
      response: dc.httpHeaders?.response ?? base.httpHeaders.response
    },
    httpBodies: dc.httpBodies ?? base.httpBodies,
    // oxlint-disable-next-line typescript/no-deprecated
    urlQueryParams: dc.urlQueryParams ?? dc.queryParams ?? base.urlQueryParams,
    graphQL: {
      document: dc.graphQL?.document ?? base.graphQL.document,
      variables: dc.graphQL?.variables ?? base.graphQL.variables
    },
    genAI: {
      inputs: dc.genAI?.inputs ?? base.genAI.inputs,
      outputs: dc.genAI?.outputs ?? base.genAI.outputs
    },
    databaseQueryData: dc.databaseQueryData ?? base.databaseQueryData,
    stackFrameVariables: dc.stackFrameVariables ?? base.stackFrameVariables,
    frameContextLines: dc.frameContextLines ?? base.frameContextLines
  };
}

export { resolveDataCollectionOptions };
//# sourceMappingURL=resolveDataCollectionOptions.js.map
