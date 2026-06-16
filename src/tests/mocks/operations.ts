import type {
  FailedOperation,
  Operation,
  SuccessfulOperation,
  UnfinishedOperation,
} from "@/features/operations";

export const idleOperation: UnfinishedOperation = {
  name: "operations/iiii-dddd-llll",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "iiii-dddd-llll",
    status: "idle",
    progressPercent: 0,
    resource: "locals/e755a4bd-8044-4529-8b5d-53f1c3887e9e",
  },
  done: false,
  response: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskCreatedResponse",
  },
};

export const succeededOperation: SuccessfulOperation = {
  name: "operations/ssss-cccc-dddd",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo test-local-3 (9c0b813f-6436-42e6-bd26-22b868f474cb)",
    operationId: "ssss-cccc-dddd",
    status: "succeeded",
    progressPercent: 100,
    resource: "locals/9c0b813f-6436-42e6-bd26-22b868f474cb",
  },
  done: true,
  response: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskResponse",
    output:
      "Would add: package1-0.2.1\nWould add: package2-1.0.0\nTotal packages that would be added: 2\n",
  },
};

export const failedOperation: FailedOperation = {
  name: "operations/ffff-llll-dddd",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "ffff-llll-dddd",
    status: "failed",
    progressPercent: 62,
    resource: "mirrors/third-party-mirror",
  },
  done: true,
  error: {
    code: 13,
    message: "The operation failed unexpectedly.",
    details: [
      "0% [Working]",
      "0% [Connecting to 10.0.1.13]",
      "0% [Waiting for headers]",
      "Get:1 http://us.archive.ubuntu.com/ubuntu/ trusty-updates/main libssl-dev amd64 1.0.1f-1ubuntu2.2 [1066 kB]",
      "0% [1 libssl-dev 2465 B/1066 kB 0%]",
      "1% [1 libssl-dev 21.9 kB/1066 kB 2%]",
      "15% [1 libssl-dev 749 kB/1066 kB 70%]",
      "21% [Working]",
      "21% [Waiting for headers]",
      "Get:2 http://us.archive.ubuntu.com/ubuntu/ trusty-updates/main libssl1.0.0 i386 1.0.1f-1ubuntu2.2 [779 kB]",
      "21% [2 libssl1.0.0:i386 1080 B/779 kB 0%]",
      "36% [Working]",
      "36% [Waiting for headers]",
      "Get:3 http://us.archive.ubuntu.com/ubuntu/ trusty-updates/main libssl1.0.0 amd64 1.0.1f-1ubuntu2.2 [826 kB]",
      "36% [3 libssl1.0.0 1080 B/826 kB 0%]",
      "39% [3 libssl1.0.0 129 kB/826 kB 15%]",
      "52% [Working]",
      "52% [Waiting for headers]",
      "Get:4 http://us.archive.ubuntu.com/ubuntu/ trusty-updates/main openssl amd64 1.0.1f-1ubuntu2.2 [488 kB]",
      "52% [4 openssl 2468 B/488 kB 0%]",
      "62% [Working]",
      "62% [Waiting for headers]",
      "Get:5 http://us.archive.ubuntu.com/ubuntu/ trusty-updates/main unity amd64 7.2.1+14.04.20140513-0ubuntu2 [1452 kB]",
      "62% [5 unity 1078 B/1452 kB 0%]",
    ],
  },
};

export const timeoutOperation: FailedOperation = {
  name: "operations/tttt-mmmm-oooo",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "tttt-mmmm-oooo",
    status: "failed",
    progressPercent: 79,
    resource: "locals/e755a4bd-8044-4529-8b5d-53f1c3887e9e",
  },
  done: true,
  error: {
    code: 4,
    message:
      "Deadline exceeded. Retry the operation or reduce the scope of the request.",
    details: [],
  },
};

export const inProgressOperation: UnfinishedOperation = {
  name: "operations/pppp-gggg-ssss",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "pppp-gggg-ssss",
    status: "in progress",
    progressPercent: 38,
    resource: "locals/e755a4bd-8044-4529-8b5d-53f1c3887e9e",
  },
  done: false,
  response: {
    "@type": "type.googleapis.com/google.protobuf.StringValue",
    output: "",
  },
};

export const emptyOperation: SuccessfulOperation = {
  name: "operations/mmmm-pppp-tttt",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo test-local-3 (9c0b813f-6436-42e6-bd26-22b868f474cb)",
    operationId: "mmmm-pppp-tttt",
    status: "succeeded",
    progressPercent: 100,
    resource: "locals/9c0b813f-6436-42e6-bd26-22b868f474cb",
  },
  done: true,
  response: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskResponse",
  },
};

export const overCountOperation: SuccessfulOperation = {
  name: "operations/oooo-vvvv-cccc",
  metadata: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description:
      "Validate import into local repo test-local-3 (9c0b813f-6436-42e6-bd26-22b868f474cb)",
    operationId: "oooo-vvvv-cccc",
    status: "succeeded",
    progressPercent: 100,
    resource: "locals/9c0b813f-6436-42e6-bd26-22b868f474cb",
  },
  done: true,
  response: {
    "@type":
      "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskResponse",
    output: [
      "Would add: package1-0.2.1",
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

export const operations: Operation[] = [
  idleOperation,
  succeededOperation,
  failedOperation,
  timeoutOperation,
  inProgressOperation,
  emptyOperation,
  overCountOperation,
];
