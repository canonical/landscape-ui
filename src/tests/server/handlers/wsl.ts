import { API_URL } from "@/constants";
import type { WslInstanceType } from "@/features/wsl";
import { wslInstanceNames } from "@/tests/mocks/wsl";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, never, WslInstanceType[]>(
    `${API_URL}wsl-instance-names`,
    () => {
      return HttpResponse.json(wslInstanceNames);
    },
  ),
];
