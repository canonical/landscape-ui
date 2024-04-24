import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { userGroups } from "@/tests/mocks/userGroup";
import { GroupsResponse } from "@/types/User";
import { GetGroupsParams, GetUserGroupsParams } from "@/hooks/useUsers";

export default [
  // @ts-ignore-next-line
  http.get<GetGroupsParams, never, GroupsResponse>(
    `${API_URL}computers/:computerId/groups`,
    () => {
      return HttpResponse.json({ groups: userGroups });
    },
  ),

  // @ts-ignore-next-line
  http.get<GetUserGroupsParams, never, GroupsResponse>(
    `${API_URL}computers/:computerId/users/:username/groups`,
    () => {
      return HttpResponse.json({ groups: userGroups });
    },
  ),
];
