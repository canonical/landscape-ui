import type { ComponentProps, FC } from "react";
import { lazy, Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";

export { default as LoginMethodsLayout } from "./components/LoginMethodsLayout/LoginMethodsLayout";
export * from "./components/AvailableProviderList";
export { default as LoginForm } from "./components/LoginForm";
export { default as ProvidersEmptyState } from "./components/ProvidersEmptyState";
export { default as ProviderList } from "./components/ProviderList";
export { default as ConsentBannerModal } from "./components/consent-banner/ConsentBannerModal";
export {
  redirectToExternalUrl,
  getSameOriginPath,
  getSameOriginUrl,
} from "./helpers";
export { useAuthHandle, useInvitation } from "./hooks";
export { getProviderIcon } from "./helpers";
export type {
  AuthStateResponse,
  LoginMethods,
  LoginRequestParams,
  GetUbuntuOneUrlParams,
} from "./hooks";
export type {
  Account,
  AuthUser,
  IdentityProvider,
  IdentityProviderFeature,
  SupportedIdentityProviderBase,
  SingleIdentityProvider,
  SupportedIdentityProvider,
} from "./types";
export type { GetInvitationSummaryParams } from "./api/types";
export * from "./api";

const SupportedProviderListComponent = lazy(
  async () => import("./components/SupportedProviderList"),
);

export const SupportedProviderList: FC<
  ComponentProps<typeof SupportedProviderListComponent>
> = (props) => {
  return (
    <Suspense fallback={<LoadingState />}>
      <SupportedProviderListComponent {...props} />
    </Suspense>
  );
};
