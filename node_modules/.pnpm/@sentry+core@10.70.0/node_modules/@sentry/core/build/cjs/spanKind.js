Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const SPAN_KIND = {
  INTERNAL: 0,
  SERVER: 1,
  CLIENT: 2,
  PRODUCER: 3,
  CONSUMER: 4
};
const SPAN_KIND_NAME = {
  [SPAN_KIND.INTERNAL]: "INTERNAL",
  [SPAN_KIND.SERVER]: "SERVER",
  [SPAN_KIND.CLIENT]: "CLIENT",
  [SPAN_KIND.PRODUCER]: "PRODUCER",
  [SPAN_KIND.CONSUMER]: "CONSUMER"
};
function spanKindToName(kind) {
  return SPAN_KIND_NAME[kind];
}

exports.SPAN_KIND = SPAN_KIND;
exports.spanKindToName = spanKindToName;
//# sourceMappingURL=spanKind.js.map
