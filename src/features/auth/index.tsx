import { ComponentProps, FC, lazy, Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";

export { default as AvailableProviderList } from "./components/AvailableProviderList";
export { default as LoginForm } from "./components/LoginForm";
export { default as ProvidersEmptyState } from "./components/ProvidersEmptyState";
export { default as ProviderList } from "./components/ProviderList";
export { redirectToExternalUrl } from "./helpers";
export { useAuthHandle, useUnsigned } from "./hooks";
export type {
  AuthStateResponse,
  LoginMethods,
  LoginRequestParams,
} from "./hooks";
export type {
  Account,
  AuthUser,
  IdentityProvider,
  SingleIdentityProvider,
  SupportedIdentityProvider,
} from "./types";

const SupportedProviderListComponent = lazy(
  () => import("./components/SupportedProviderList"),
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
