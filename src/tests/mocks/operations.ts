import type { PackagesValidationOperation } from "@/features/operations";

export const idleOperation: PackagesValidationOperation = {
  name: "operations/iiii-dddd-llll",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "iiii-dddd-llll",
    status: "idle",
  },
  done: false,
  response: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskCreatedResponse",
  },
};

export const succeededOperation: PackagesValidationOperation = {
  name: "operations/ssss-cccc-dddd",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo test-local-3 (9c0b813f-6436-42e6-bd26-22b868f474cb)",
    operationId: "ssss-cccc-dddd",
    status: "succeeded",
  },
  done: true,
  response: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskResponse",
    output:
      "Would add: python3-snap-http_1.4.0-0ubuntu0_all\nWould add: package2-1.0.0\nTotal packages that would be added: 2\n",
  },
};

export const failedOperation: PackagesValidationOperation = {
  name: "operations/ffff-llll-dddd",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "ffff-llll-dddd",
    status: "failed",
  },
  done: true,
  error: {
    code: 13,
    message: "The operation failed unexpectedly.",
    details: [],
  },
};

export const timeoutOperation: PackagesValidationOperation = {
  name: "operations/tttt-mmmm-oooo",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "tttt-mmmm-oooo",
    status: "failed",
  },
  done: true,
  error: {
    code: 4,
    message:
      "Deadline exceeded. Retry the operation or reduce the scope of the request.",
    details: [],
  },
};

export const inProgressOperation: PackagesValidationOperation = {
  name: "operations/pppp-gggg-ssss",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "pppp-gggg-ssss",
    status: "in progress",
  },
  done: false,
  response: {
    "@type": "type.googleapis.com/google.protobuf.StringValue",
    output: "",
  },
};

export const emptyOperation: PackagesValidationOperation = {
  name: "operations/mmmm-pppp-tttt",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo test-local-3 (9c0b813f-6436-42e6-bd26-22b868f474cb)",
    operationId: "mmmm-pppp-tttt",
    status: "succeeded",
  },
  done: true,
  response: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskResponse",
  },
};

export const overCountOperation: PackagesValidationOperation = {
  name: "operations/oooo-vvvv-cccc",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo test-local-3 (9c0b813f-6436-42e6-bd26-22b868f474cb)",
    operationId: "oooo-vvvv-cccc",
    status: "succeeded",
  },
  done: true,
  response: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskResponse",
    output: [
      "Would add: python3-snap-http_1.4.0-0ubuntu0_all",
      "Would add: package2-1.0.0",
      "Would add: package3-2.1.0",
      "Would add: package4-0.9.1",
      "Would add: package5-3.0.0",
      "Would add: package6-1.2.3",
      "Would add: package7-4.5.6",
      "Would add: package8-2.0.0",
      "Would add: package9-1.1.1",
      "Would add: package10-0.5.0",
      "Would add: package11-3.2.1",
      "Would add: package12-1.0.0",
      "Would add: package13-2.3.4",
      "Would add: package14-5.0.0",
      "Would add: package15-1.4.0",
      "Would add: package16-0.8.2",
      "Would add: package17-3.1.0",
      "Would add: package18-2.2.2",
      "Would add: package19-1.0.1",
      "Would add: package20-4.0.0",
      "Would add: package21-0.3.0",
      "Would add: package22-1.5.0",
      "Would add: package23-2.0.1",
      "Would add: package24-3.3.3",
      "Would add: package25-1.0.2",
      "Would add: package26-0.7.0",
      "Would add: package27-2.1.1",
      "Would add: package28-4.2.0",
      "Would add: package29-1.3.0",
      "Would add: package30-0.6.1",
      "Would add: package31-3.0.1",
      "Would add: package32-2.4.0",
      "Would add: package33-1.1.0",
      "Would add: package34-5.1.0",
      "Would add: package35-0.9.0",
      "Would add: package36-2.0.2",
      "Would add: package37-1.6.0",
      "Would add: package38-3.4.0",
      "Would add: package39-0.4.0",
      "Would add: package40-2.5.0",
      "Would add: package41-1.0.3",
      "Would add: package42-4.1.0",
      "Would add: package43-0.2.0",
      "Would add: package44-3.5.0",
      "Would add: package45-1.7.0",
      "Would add: package46-2.6.0",
      "Would add: package47-5.2.0",
      "Would add: package48-0.1.0",
      "Would add: package49-1.8.0",
      "Would add: package50-3.6.0",
      "Would add: package51-2.7.0",
      "Would add: package52-4.3.0",
      "Would add: package53-1.9.0",
      "Would add: package54-0.8.0",
      "Would add: package55-3.7.0",
      "Would add: package56-2.8.0",
      "Would add: package57-5.3.0",
      "Would add: package58-1.0.4",
      "Would add: package59-4.4.0",
      "Would add: package60-0.6.0",
      "Would add: package61-3.8.0",
      "Would add: package62-2.9.0",
      "Would add: package63-1.2.0",
      "Would add: package64-5.4.0",
      "Would add: package65-0.5.1",
      "Would add: package66-4.5.0",
      "Would add: package67-3.9.0",
      "Would add: package68-2.0.3",
      "Would add: package69-1.3.1",
      "Would add: package70-5.5.0",
      "Would add: package71-0.4.1",
      "Would add: package72-4.6.0",
      "Would add: package73-3.0.2",
      "Would add: package74-2.1.2",
      "Would add: package75-1.4.1",
      "Would add: package76-5.6.0",
      "Would add: package77-0.3.1",
      "Would add: package78-4.7.0",
      "Would add: package79-3.1.1",
      "Would add: package80-2.2.0",
      "Would add: package81-1.5.1",
      "Would add: package82-5.7.0",
      "Would add: package83-0.2.1",
      "Would add: package84-4.8.0",
      "Would add: package85-3.2.0",
      "Would add: package86-2.3.0",
      "Would add: package87-1.6.1",
      "Would add: package88-5.8.0",
      "Would add: package89-0.1.1",
      "Would add: package90-4.9.0",
      "Would add: package91-3.3.0",
      "Would add: package92-2.4.1",
      "Would add: package93-1.7.1",
      "Would add: package94-5.9.0",
      "Would add: package95-0.9.2",
      "Would add: package96-4.0.1",
      "Would add: package97-3.4.1",
      "Would add: package98-2.5.1",
      "Would add: package99-1.8.1",
      "Would add: package100-6.0.0",
      "Total packages that would be added: 147",
      "",
    ].join("\n"),
  },
};
