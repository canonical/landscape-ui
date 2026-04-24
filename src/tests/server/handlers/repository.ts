import { API_URL } from "@/constants";
import { delay, http, HttpResponse } from "msw";
import type { UbuntuArchiveInfo } from "@/features/mirrors";
import {
  ubuntuArchiveInfo,
  ubuntuESMInfo,
} from "@/tests/mocks/ubuntuArchiveInfo";

export default [
  http.get(`${API_URL}repository/ubuntu-archive-info`, async ({ request }) => {
    const archiveType = new URL(request.url).searchParams.get("archive_type");

    await delay();

    if (archiveType === "archive") {
      return HttpResponse.json<UbuntuArchiveInfo>(ubuntuArchiveInfo);
    } else if (archiveType === "ESM") {
      return HttpResponse.json<{ results: UbuntuArchiveInfo[] }>({
        results: ubuntuESMInfo,
      });
    } else {
      return HttpResponse.json(null, { status: 400 });
    }
  }),
];
