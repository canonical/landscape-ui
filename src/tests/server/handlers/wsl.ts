import { API_URL } from "@/constants";
import { WslInstanceName } from "@/hooks/useWsl";
import { wslInstanceNames } from "@/tests/mocks/wsl";
import { http, HttpResponse } from "msw";

export default [
  // @ts-ignore-next-line
  http.get<undefined, never, WslInstanceName[]>(
    `${API_URL}wsl-instance-names`,
    () => {
      return HttpResponse.json(wslInstanceNames);
    },
  ),
];
