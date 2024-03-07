import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { userGroups } from "@/tests/mocks/userGroup";
import { GroupsResponse } from "@/types/User";
import { GetGroupsParams } from "@/hooks/useUsers";

export default [
  // @ts-ignore-next-line
  http.get<GetGroupsParams, never, GroupsResponse>(
    `${API_URL}computers/:computerId/groups`,
    () => {
      return HttpResponse.json(userGroups);
    },
  ),
];
