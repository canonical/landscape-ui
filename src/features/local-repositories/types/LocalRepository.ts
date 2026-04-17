export interface UploadersGroup {
  title: string,
  users?: string[],
}

export interface  UploadersRule {
  condition: string,
  allow?: string[],
  deny?: string[],
}

export interface Uploaders {
  groups?: UploadersGroup[],
  rules?: UploadersRule[],
}

export interface LocalRepository extends Record<string, unknown> {
  name: string,
  local_id: string,
  display_name: string,
  comment?: string,
  default_distribution?: string,
  default_component?: string,
  uploaders?: Uploaders,
}
