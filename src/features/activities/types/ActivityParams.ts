export interface GetActivitiesParams {
  limit?: number;
  offset?: number;
  query?: string;
}

export interface GetSingleActivityParams {
  activityId: number;
}

export interface CancelActivitiesParams {
  query: string;
}

export interface ApproveActivitiesParams {
  query: string;
}

export interface RedoActivitiesParams {
  activity_ids: number[];
}
