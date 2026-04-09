import { API_URL } from "@/constants";
import type { PublicationTarget } from "@/features/publication-targets";
import { publicationTargetsWithPublications } from "@/tests/mocks/publication-targets";
import { http, HttpResponse } from "msw";

export default [
  http.get(`${API_URL}publicationTargets`, () => {
    return HttpResponse.json({
      publication_targets: publicationTargetsWithPublications,
    });
  }),

  http.post(`${API_URL}publicationTargets`, async ({ request }) => {
    const body = (await request.json()) as Omit<
      PublicationTarget,
      "name" | "publication_target_id"
    >;
    const newTarget: PublicationTarget = {
      name: `publicationTargets/new-${Date.now()}`,
      publication_target_id: `new-${Date.now()}`,
      ...body,
    };
    return HttpResponse.json(newTarget, { status: 201 });
  }),

  http.delete(
    `${API_URL}publicationTargets/:id`,
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.patch(`${API_URL}publicationTargets/:id`, async ({ request }) => {
    const body = (await request.json()) as PublicationTarget;
    return HttpResponse.json(body);
  }),
];
