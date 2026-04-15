export interface Any {
  "@type"?: string;
  [key: string]: unknown;
}

export interface Status {
  code?: number;
  message?: string;
  details?: Any[];
}

export interface GpgKeyWritable {
  armor: string;
}

export interface GpgKey extends Record<string, unknown> {
  armor: string;
}

export interface UploadersGroup {
  title: string;
  users?: string[];
}

export interface UploadersRule {
  condition: string;
  allow?: string[];
  deny?: string[];
}

export interface Uploaders {
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
  component?: string;
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
  mirror: string;
  distribution: string;
  component: string;
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

export interface Task {
  name?: string;
  displayName?: string;
  taskId?: string;
  status?: string;
  output?: string;
}

export interface PublishPublicationResponse {
  task?: Task;
}
