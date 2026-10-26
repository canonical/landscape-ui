// Lists the named exports of an installed package from its type declarations.
// A plain `import()` of the Pragma React packages fails under Node because they
// import CSS as a side effect, so read the public surface through TypeScript.
//
// Usage: node .github/skills/pragma/list-exports.mjs @canonical/react-ds-global [filter]
import { createRequire } from "node:module";
import path from "node:path";
import ts from "typescript";

const [packageName, filter] = process.argv.slice(2);

if (!packageName) {
  console.error("Usage: list-exports.mjs <package> [case-insensitive filter]");
  process.exit(1);
}

const require = createRequire(path.join(process.cwd(), "/"));
const manifestPath = require.resolve(`${packageName}/package.json`);
const manifest = require(manifestPath);
const typesEntry =
  manifest.exports?.["."]?.types ?? manifest.types ?? manifest.typings;

if (!typesEntry) {
  console.error(`${packageName} declares no types entry.`);
  process.exit(1);
}

const entry = path.join(path.dirname(manifestPath), typesEntry);
const program = ts.createProgram([entry], {});
const checker = program.getTypeChecker();
const moduleSymbol = checker.getSymbolAtLocation(program.getSourceFile(entry));
const names = checker
  .getExportsOfModule(moduleSymbol)
  .map((symbol) => symbol.name)
  .filter(
    (name) => !filter || name.toLowerCase().includes(filter.toLowerCase()),
  )
  .sort();

console.log(names.join("\n"));
