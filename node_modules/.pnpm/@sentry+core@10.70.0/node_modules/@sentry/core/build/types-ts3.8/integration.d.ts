import { Client } from './client';
import { Integration, IntegrationFn } from './types/integration';
import { CoreOptions } from './types/options';
export declare const installedIntegrations: string[];
/** Map of integrations assigned to a client */
export type IntegrationIndex = {
    [key: string]: Integration;
};
/** Gets integrations to install */
export declare function getIntegrationsToSetup(options: Pick<CoreOptions, 'defaultIntegrations' | 'integrations'>): Integration[];
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */
export declare function setupIntegrations(client: Client, integrations: Integration[]): IntegrationIndex;
/**
 * Execute the `afterAllSetup` hooks of the given integrations.
 */
export declare function afterSetupIntegrations(client: Client, integrations: Integration[]): void;
/** Setup a single integration.  */
export declare function setupIntegration(client: Client, integration: Integration, integrationIndex: IntegrationIndex): void;
/** Add an integration to the current scope's client. */
export declare function addIntegration(integration: Integration): void;
/**
 * Define an integration function that can be used to create an integration instance.
 * Note that this by design hides the implementation details of the integration, as they are considered internal.
 */
export declare function defineIntegration<Fn extends IntegrationFn>(fn: Fn): (...args: Parameters<Fn>) => Integration & {
    name: ReturnType<Fn>['name'];
};
type IntegrationWithOtherProperties = Record<string, unknown> & Integration;
type ExtendedIntegration<Base extends Integration, Extended extends Partial<IntegrationWithOtherProperties>> = Pick<Base, Exclude<keyof Base, keyof Extended>> & Extended;
/**
 * Wrap a parent integration with an extended integration.
 * Any passed integration function will call the parent integration function first, if it exists.
 *
 * Example usage:
 *
 * @example
 * ```typescript
 * const parentIntegration = defineIntegration(() => ({
 *   name: 'ParentIntegration',
 *   setupOnce: () => {
 *     console.log('ParentIntegration setupOnce');
 *   },
 * }));
 *
 * const extendedIntegration = extendIntegration(parentIntegration, {
 *   setupOnce: () => {
 *     console.log('ExtendedIntegration setupOnce');
 *   },
 * });
 * ```
 */
export declare function extendIntegration<Base extends Integration, Extended extends Partial<IntegrationWithOtherProperties>>(integration: Base, extendedIntegration: Extended): ExtendedIntegration<Base, Extended>;
export {};
//# sourceMappingURL=integration.d.ts.map
