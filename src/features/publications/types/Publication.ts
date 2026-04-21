interface GpgKeyWritable {
  armor: string;
}

interface GpgKey extends Record<string, unknown> {
  armor: string;
}

interface UploadersGroup {
  title: string;
  users?: string[];
}

interface UploadersRule {
  condition: string;
  allow?: string[];
  deny?: string[];
}

interface Uploaders {
  groups?: UploadersGroup[];
  rules?: UploadersRule[];
}

export interface Local extends Record<string, unknown> {
  name?: string;
  localId?: string;
  displayName: string;
  comment?: string;
  defaultDistribution?: string;
  defaultComponent?: string;
  uploaders?: Uploaders;
}

export interface Mirror extends Record<string, unknown> {
  name?: string;
  mirrorId?: string;
  status?: string;
  displayName: string;
  archiveRoot: string;
  distribution?: string;
  architectures?: string[];
  components?: string[];
}

export interface PublicationTarget extends Record<string, unknown> {
  name?: string;
  displayName: string;
  publicationTargetId?: string;
}

export interface PublicationWritable {
  name?: string;
  publicationTarget: string;
  source: string;
  distribution?: string;
  label?: string;
  origin?: string;
  architectures?: string[];
  acquireByHash?: boolean;
  butAutomaticUpgrades?: boolean;
  notAutomatic?: boolean;
  multiDist?: boolean;
  skipBz2?: boolean;
  skipContents?: boolean;
  gpgKey?: GpgKeyWritable;
}

export interface Publication extends Record<string, unknown> {
  publicationId: string;
  name: string;
  publicationTarget: string;
  source: string;
  distribution: string;
  label: string;
  origin: string;
  architectures: string[];
  acquireByHash: boolean;
  butAutomaticUpgrades: boolean;
  notAutomatic: boolean;
  multiDist: boolean;
  skipBz2: boolean;
  skipContents: boolean;
  gpgKey?: GpgKey;
}

export interface ListPublicationsResponse {
  publications?: Publication[];
  nextPageToken?: string;
}

export interface ListLocalsResponse {
  locals?: Local[];
  nextPageToken?: string;
}

export interface ListMirrorsResponse {
  mirrors?: Mirror[];
  nextPageToken?: string;
}

export interface ListPublicationTargetsResponse {
  publicationTargets?: PublicationTarget[];
  nextPageToken?: string;
}

interface Task {
  name?: string;
  displayName?: string;
  taskId?: string;
  status?: string;
  output?: string;
}

export interface PublishPublicationResponse {
  task?: Task;
}

export interface PublicationServicePublishPublicationBody {
  forceOverwrite: boolean;
  forceCleanup: boolean;
}
