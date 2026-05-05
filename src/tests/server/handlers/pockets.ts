import { API_URL, API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import { http, HttpResponse } from "msw";
import { isAction } from "./_helpers";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get(API_URL_OLD, async ({ request }) => {
    if (
      !isAction(request, [
        "EditPocket",
        "SyncMirrorPocket",
        "PullPackagesToPocket",
      ])
    ) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    const action = new URL(request.url).searchParams.get("action");
    if (
      endpointStatus.status === "loading" &&
      endpointStatus.path === "SyncMirrorPocket" &&
      isAction(request, "SyncMirrorPocket")
    ) {
      return new Promise<never>(() => undefined);
    }

    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === action)
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json(activities[0]);
  }),
  http.get(API_URL_OLD, async ({ request }) => {
    if (
      !isAction(request, [
        "RemovePocket",
        "RemovePackagesFromPocket",
        "AddPackageFiltersToPocket",
        "RemovePackageFiltersFromPocket",
        "AddUploaderGPGKeysToPocket",
        "RemoveUploaderGPGKeysFromPocket",
      ])
    ) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    const action = new URL(request.url).searchParams.get("action");
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === action)
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json(null);
  }),
  http.post(`${API_URL}pockets/sync`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "pockets/sync")
    ) {
      throw createEndpointStatusError();
    }
    return HttpResponse.json(activities[0]);
  }),
  http.post(`${API_URL}pockets/pull`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "pockets/pull")
    ) {
      throw createEndpointStatusError();
    }
    return HttpResponse.json(activities[0]);
  }),
  http.delete(`${API_URL}pockets/:distribution/:series/:name`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "pockets/delete")
    ) {
      throw createEndpointStatusError();
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
