import { API_URL } from "@/constants";
import type { WslInstanceName } from "@/features/wsl";
import { wslInstanceNames } from "@/tests/mocks/wsl";
import { http, HttpResponse } from "msw";

export default [
  // @ts-expect-error-next-line
  http.get<undefined, never, WslInstanceName[]>(
    `${API_URL}wsl-instance-names`,
    () => {
      return HttpResponse.json(wslInstanceNames);
    },
  ),
];
