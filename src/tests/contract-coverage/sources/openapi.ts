import fs from "fs";
import { createRequire } from "module";
import { parse as parseYaml } from "yaml";
import { patternToRegExp } from "../matcher";
import type { ContractSource, RouteDefinition } from "../types";

const require = createRequire(import.meta.url);

interface OpenApiParameter {
  name?: string;
  in?: string;
  schema?: { pattern?: string };
}

interface OpenApiOperation {
  parameters?: OpenApiParameter[];
}

interface OpenApiSpec {
  paths?: Record<string, Record<string, OpenApiOperation>>;
}

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];

/**
 * The packaged document format changed across @canonical/landscape-openapi
 * versions (openapi.json up to 0.0.59, openapi.yaml from 0.0.70) — accept
 * either.
 */
function loadSpec(): OpenApiSpec {
  const candidates: [string, (raw: string) => unknown][] = [
    ["openapi.yaml", parseYaml],
    ["openapi.json", JSON.parse],
  ];
  for (const [file, parser] of candidates) {
    let specPath: string;
    try {
      specPath = require.resolve(`@canonical/landscape-openapi/${file}`);
    } catch {
      continue;
    }
    return parser(fs.readFileSync(specPath, "utf-8")) as OpenApiSpec;
  }
  throw new Error(
    "No OpenAPI document (openapi.yaml/openapi.json) found in @canonical/landscape-openapi",
  );
}

/**
 * Resolves a gRPC-transcoded wildcard parameter into canonical segments,
 * e.g. "{name_1}" with schema pattern "mirrors/[^/]+" -> "mirrors/{name_1}",
 * and "operations/.+" -> "operations/{name_2...}" (multi-segment).
 */
function resolveWildcardParam(paramName: string, schemaPattern: string): string {
  const resolved = schemaPattern
    .replace(/\[\^\/\]\+/g, `{${paramName}}`)
    .replace(/\.\+/g, `{${paramName}...}`);
  if (/[[\]()\\^$+*?|]/.test(resolved)) {
    console.warn(
      `[!] Unrecognized regex construct in path param pattern "${schemaPattern}" — treating "${paramName}" as multi-segment.`,
    );
    return `{${paramName}...}`;
  }
  return resolved;
}

/**
 * Connector for the Go backend's real contract: the OpenAPI document shipped
 * in @canonical/landscape-openapi. `basePath` is the prefix the service is
 * mounted under in the frontend (VITE_API_URL_DEB_ARCHIVE minus the spec's
 * own /v1beta1 prefix).
 */
export function createOpenApiSource(basePath: string): ContractSource {
  const spec = loadSpec();

  const routes: { definition: RouteDefinition; regExp: RegExp }[] = [];

  for (const [specPath, operations] of Object.entries(spec.paths ?? {})) {
    for (const [method, operation] of Object.entries(operations)) {
      if (!HTTP_METHODS.includes(method)) continue;

      let pattern = `${basePath}${specPath}`;
      for (const param of operation.parameters ?? []) {
        if (param.in !== "path" || !param.name) continue;
        const schemaPattern = param.schema?.pattern;
        if (!schemaPattern) continue;
        pattern = pattern.replace(
          `{${param.name}}`,
          resolveWildcardParam(param.name, schemaPattern),
        );
      }

      const upperMethod = method.toUpperCase();
      routes.push({
        definition: {
          id: `${upperMethod} ${pattern}`,
          method: upperMethod,
          pattern,
          backend: "go",
          source: "openapi",
        },
        regExp: patternToRegExp(pattern),
      });
    }
  }

  return {
    name: "openapi",
    listRoutes: () => routes.map((route) => route.definition),
    match: (method, url) => {
      for (const route of routes) {
        if (route.definition.method !== method) continue;
        if (route.regExp.test(url.pathname)) return route.definition;
      }
      return null;
    },
  };
}