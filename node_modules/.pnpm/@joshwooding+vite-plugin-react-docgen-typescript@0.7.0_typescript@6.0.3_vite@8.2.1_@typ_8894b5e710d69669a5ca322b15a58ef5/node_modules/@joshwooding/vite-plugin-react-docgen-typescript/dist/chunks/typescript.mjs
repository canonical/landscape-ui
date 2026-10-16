import { dirname } from 'node:path';
import ts from 'typescript';

function formatDiagnostic(diagnostic) {
  if (typeof diagnostic.messageText === "string") {
    return diagnostic.messageText;
  }
  return ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
}
function getTSConfigFile(tsconfigPath) {
  const basePath = dirname(tsconfigPath);
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(
      `Failed to read tsconfig at "${tsconfigPath}": ${formatDiagnostic(configFile.error)}`
    );
  }
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    basePath,
    {},
    tsconfigPath
  );
  if (parsedConfig.errors.length > 0) {
    const errorText = parsedConfig.errors.map(formatDiagnostic).join("\n");
    throw new Error(
      `Failed to parse tsconfig at "${tsconfigPath}": ${errorText}`
    );
  }
  return parsedConfig;
}

export { getTSConfigFile };
