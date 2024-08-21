import { IdentityProvider } from "@/features/identity-providers";

export const identityProviders: IdentityProvider[] = [
  {
    clientId: "client1",
    clientSecret: "secret1",
    enabled: true,
    id: 1,
    name: "Ubuntu One",
    oidcDiscoverySupported: true,
    oidcServerUrl: "http://oidc-server-url",
    provider: "Ubuntu One",
    scopes: [],
    url: "http://identity-provider-url",
    users: [
      {
        name: "John Doe",
        id: 1,
        email: "john.doe@example.com",
      },
    ],
  },
  {
    clientId: "client2",
    clientSecret: "secret2",
    enabled: false,
    id: 2,
    name: "Ubuntu Two",
    oidcDiscoverySupported: true,
    oidcServerUrl: "http://oidc-server-url",
    provider: "Ubuntu One",
    scopes: [],
    url: "http://identity-provider-url",
    users: [
      {
        name: "John Doe",
        id: 1,
        email: "john.doe@example.com",
      },
    ],
  },
];

export const supportedProviders = ["provider1", "provider2"];
