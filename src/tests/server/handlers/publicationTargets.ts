import { API_URL_DEB_ARCHIVE } from "@/constants";
import type { PublicationTarget } from "@/features/publication-targets";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { http, HttpResponse } from "msw";

export default [
  http.post(`${API_URL_DEB_ARCHIVE}publicationTargets`, async ({ request }) => {
    const body = (await request.json()) as Omit<
      PublicationTarget,
      "name" | "publicationTargetId"
    >;
    const now = Date.now();
    const newTarget: PublicationTarget = {
      name: `publicationTargets/new-${now}`,
      publicationTargetId: `new-${now}`,
      ...body,
    };
    return HttpResponse.json(newTarget, { status: 201 });
  }),

  http.delete(`${API_URL_DEB_ARCHIVE}publicationTargets/:id`, ({ params }) => {
    const idx = publicationTargets.findIndex(
      (t) => t.name === `publicationTargets/${params.id}`,
    );
    if (idx !== -1) publicationTargets.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(
    `${API_URL_DEB_ARCHIVE}publicationTargets/:id`,
    async ({ params, request }) => {
      const body = (await request.json()) as Partial<PublicationTarget>;
      const idx = publicationTargets.findIndex(
        (t) => t.name === `publicationTargets/${params.id}`,
      );
      const existing = publicationTargets[idx];
      if (idx === -1 || !existing)
        return new HttpResponse(null, { status: 404 });
      const updated: PublicationTarget = {
        ...existing,
        ...body,
        ...(body.s3 ? { s3: { ...existing.s3, ...body.s3 } } : {}),
        ...(body.swift ? { swift: { ...existing.swift, ...body.swift } } : {}),
      } as PublicationTarget;
      publicationTargets[idx] = updated;
      return HttpResponse.json(updated);
    },
  ),

  // Fallback GET for integration tests that don't mock useGetPublicationTargets directly
  http.get(`${API_URL_DEB_ARCHIVE}publicationTargets`, () => {
    return HttpResponse.json({
      publicationTargets,
    });
  }),
];
