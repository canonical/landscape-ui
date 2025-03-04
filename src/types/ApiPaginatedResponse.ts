import type { ApiListResponse } from "@/types/ApiListResponse";

export interface ApiPaginatedResponse<T> extends ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
}
