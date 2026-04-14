import { API_URL_DEBARCHIVE } from "@/constants";
import type { PublicationTarget } from "@/features/publication-targets";
import { publicationTargets } from "@/tests/mocks/publication-targets";
import { http, HttpResponse } from "msw";

export default [
  http.post(`${API_URL_DEBARCHIVE}v1/publicationTargets`, async ({ request }) => {
    const body = (await request.json()) as Omit<
      PublicationTarget,
      "name" | "publicationTargetId"
    >;
    const newTarget: PublicationTarget = {
      name: `publicationTargets/new-${Date.now()}`,
      publicationTargetId: `new-${Date.now()}`,
      ...body,
    };
    return HttpResponse.json(newTarget, { status: 201 });
  }),

  http.delete(
    `${API_URL_DEBARCHIVE}v1/publicationTargets/:id`,
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.patch(`${API_URL_DEBARCHIVE}v1/publicationTargets/:id`, async ({ request }) => {
    const body = (await request.json()) as PublicationTarget;
    return HttpResponse.json(body);
  }),

  // Fallback GET for integration tests that don't mock useGetPublicationTargets directly
  http.get(`${API_URL_DEBARCHIVE}v1/publicationTargets`, () => {
    return HttpResponse.json({
      publicationTargets,
    });
  }),
];
