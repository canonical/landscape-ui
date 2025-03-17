import type { OidcIssuer } from "@/features/oidc";
import { oidcIssuers } from "@/tests/mocks/oidcIssuers";
import { generateGetListEndpoint } from "@/tests/server/handlers/_helpers";

export default [
  generateGetListEndpoint<OidcIssuer>({
    path: "auth/oidc-issuers",
    response: oidcIssuers,
  }),
];
