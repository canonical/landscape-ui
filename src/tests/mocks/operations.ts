export const idleOperation = {
  name: "operations/iiii-dddd-llll",
  metadata: {
    "@type": "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description: "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "iiii-dddd-llll",
    status: "idle"
  },
  done: false,
  response: {
    "@type": "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskCreatedResponse"
  }
};

// export const succeededOperation = {
//   name: "operations/ssss-cccc-dddd",
//   metadata: {
//     "@type": "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
//     description: "Validate import into local repo test-local-3 (9c0b813f-6436-42e6-bd26-22b868f474cb)",
//     operationId: "ssss-cccc-dddd",
//     status: "succeeded"
//   },
//   done: true,
//   response: {
//     "@type": "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskResponse",
//     value: "Would add: python3-snap-http_1.4.0-0ubuntu0_all\nWould add: package2-1.0.0\nTotal packages that would be added: 123\n"
//   }
// };

export const failedOperation = {
  name: "operations/ffff-llll-dddd",
  metadata: {
    "@type": "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description: "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "ffff-llll-dddd",
    status: "failed"
  },
  done: true,
  error: {
    code: 13,
    message: "task failed unexpectedly: ",
    details: []
  }
};

export const inProgressOperation = {
  name: "operations/pppp-gggg-ssss",
  metadata: {
    "@type": "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description: "Validate import into local repo Noble Security Patches (e755a4bd-8044-4529-8b5d-53f1c3887e9e)",
    operationId: "pppp-gggg-ssss",
    status: "in progress"
  },
  done: false,
  response: {
    "@type": "type.googleapis.com/google.protobuf.StringValue",
    value: ""
  }
};

export const emptyOperation = {
  name: "operations/mmmm-pppp-tttt",
  metadata: {
    "@type": "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description: "Validate import into local repo test-local-3 (9c0b813f-6436-42e6-bd26-22b868f474cb)",
    operationId: "mmmm-pppp-tttt",
    status: "succeeded"
  },
  done: true,
  response: {
    "@type": "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskResponse",
  }
};

export const succeededOperation = {
  name: "operations/ssss-cccc-dddd",
  metadata: {
    "@type": "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskMetadata",
    description: "Validate import into local repo test-local-3 (9c0b813f-6436-42e6-bd26-22b868f474cb)",
    operationId: "ssss-cccc-dddd",
    status: "succeeded"
  },
  done: true,
  response: {
    "@type": "type.googleapis.com/canonical.landscape.debarchive.v1beta1.TaskResponse",
    value: "Would add: python3-snap-http_1.4.0-0ubuntu0_all\nWould add: package2-1.0.0\nWould add: package3-2.1.0\nWould add: package4-0.9.1\nWould add: package5-3.0.0\nWould add: package6-1.2.3\nWould add: package7-4.5.6\nWould add: package8-2.0.0\nWould add: package9-1.1.1\nWould add: package10-0.5.0\nWould add: package11-3.2.1\nWould add: package12-1.0.0\nWould add: package13-2.3.4\nWould add: package14-5.0.0\nWould add: package15-1.4.0\nWould add: package16-0.8.2\nWould add: package17-3.1.0\nWould add: package18-2.2.2\nWould add: package19-1.0.1\nWould add: package20-4.0.0\nWould add: package21-0.3.0\nWould add: package22-1.5.0\nWould add: package23-2.0.1\nWould add: package24-3.3.3\nWould add: package25-1.0.2\nWould add: package26-0.7.0\nWould add: package27-2.1.1\nWould add: package28-4.2.0\nWould add: package29-1.3.0\nWould add: package30-0.6.1\nWould add: package31-3.0.1\nWould add: package32-2.4.0\nWould add: package33-1.1.0\nWould add: package34-5.1.0\nWould add: package35-0.9.0\nWould add: package36-2.0.2\nWould add: package37-1.6.0\nWould add: package38-3.4.0\nWould add: package39-0.4.0\nWould add: package40-2.5.0\nWould add: package41-1.0.3\nWould add: package42-4.1.0\nWould add: package43-0.2.0\nWould add: package44-3.5.0\nWould add: package45-1.7.0\nWould add: package46-2.6.0\nWould add: package47-5.2.0\nWould add: package48-0.1.0\nWould add: package49-1.8.0\nWould add: package50-3.6.0\nWould add: package51-2.7.0\nWould add: package52-4.3.0\nWould add: package53-1.9.0\nWould add: package54-0.8.0\nWould add: package55-3.7.0\nWould add: package56-2.8.0\nWould add: package57-5.3.0\nWould add: package58-1.0.4\nWould add: package59-4.4.0\nWould add: package60-0.6.0\nWould add: package61-3.8.0\nWould add: package62-2.9.0\nWould add: package63-1.2.0\nWould add: package64-5.4.0\nWould add: package65-0.5.1\nWould add: package66-4.5.0\nWould add: package67-3.9.0\nWould add: package68-2.0.3\nWould add: package69-1.3.1\nWould add: package70-5.5.0\nWould add: package71-0.4.1\nWould add: package72-4.6.0\nWould add: package73-3.0.2\nWould add: package74-2.1.2\nWould add: package75-1.4.1\nWould add: package76-5.6.0\nWould add: package77-0.3.1\nWould add: package78-4.7.0\nWould add: package79-3.1.1\nWould add: package80-2.2.0\nWould add: package81-1.5.1\nWould add: package82-5.7.0\nWould add: package83-0.2.1\nWould add: package84-4.8.0\nWould add: package85-3.2.0\nWould add: package86-2.3.0\nWould add: package87-1.6.1\nWould add: package88-5.8.0\nWould add: package89-0.1.1\nWould add: package90-4.9.0\nWould add: package91-3.3.0\nWould add: package92-2.4.1\nWould add: package93-1.7.1\nWould add: package94-5.9.0\nWould add: package95-0.9.2\nWould add: package96-4.0.1\nWould add: package97-3.4.1\nWould add: package98-2.5.1\nWould add: package99-1.8.1\nWould add: package100-6.0.0\nTotal packages that would be added: 147\n"
  }
};
