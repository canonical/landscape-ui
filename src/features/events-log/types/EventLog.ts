export interface EventLog extends Record<string, unknown> {
  creation_time: string;
  entity_id: number;
  entity_name: string;
  entity_type: string;
  id: number;
  message: string;
  person_id: number;
  person_name: string;
}
