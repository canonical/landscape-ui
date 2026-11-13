const IDENTIFIER_PATH_PATTERN = /^[$A-Z_a-z][$\w]*(?:\.[$A-Z_a-z][$\w]*)*$/;
const LOOSE_EXPRESSION_PATTERN = /^[$A-Z_a-z0-9.-]+$/;
function getTargetExpression(targetExpression) {
  if (!targetExpression) {
    return null;
  }
  if (IDENTIFIER_PATH_PATTERN.test(targetExpression)) {
    return targetExpression;
  }
  if (LOOSE_EXPRESSION_PATTERN.test(targetExpression)) {
    return targetExpression;
  }
  return null;
}
function sanitizeDocgenValue(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (value === null || typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    return value;
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      const sanitizedItem = sanitizeDocgenValue(item, seen);
      return sanitizedItem === void 0 ? [] : [sanitizedItem];
    });
  }
  if (typeof value !== "object") {
    return void 0;
  }
  if (seen.has(value)) {
    return void 0;
  }
  seen.add(value);
  const sanitizedEntries = Object.entries(value).flatMap(
    ([key, entryValue]) => {
      const sanitizedValue = sanitizeDocgenValue(entryValue, seen);
      return sanitizedValue === void 0 ? [] : [[key, sanitizedValue]];
    }
  );
  seen.delete(value);
  return Object.fromEntries(sanitizedEntries);
}
function createPropDefinition(prop, options) {
  const declarations = sanitizeDocgenValue(prop.declarations);
  const parent = sanitizeDocgenValue(prop.parent);
  const tags = sanitizeDocgenValue(prop.tags) ?? {};
  const defaultValue = sanitizeDocgenValue(prop.defaultValue) ?? null;
  const type = sanitizeDocgenValue(prop.type) ?? { name: prop.type.name };
  return {
    defaultValue,
    ...declarations ? { declarations } : {},
    description: prop.description,
    name: prop.name,
    ...parent ? { parent } : {},
    required: prop.required,
    tags,
    [options.typePropName]: type
  };
}
function serializeComponentDoc(componentDoc, options) {
  const props = Object.fromEntries(
    Object.entries(componentDoc.props).map(([propName, prop]) => [
      propName,
      createPropDefinition(prop, options)
    ])
  );
  return JSON.stringify({
    description: componentDoc.description,
    displayName: componentDoc.displayName,
    filePath: componentDoc.filePath,
    methods: sanitizeDocgenValue(componentDoc.methods) ?? [],
    props,
    tags: sanitizeDocgenValue(componentDoc.tags) ?? {}
  });
}
function indentBlock(block) {
  return block.split("\n").map((line) => `    ${line}`).join("\n");
}
function createComponentCode(componentDoc, options) {
  const targetExpression = getTargetExpression(componentDoc.targetExpression);
  if (!targetExpression) {
    return "";
  }
  const statements = [];
  if (options.setDisplayName) {
    statements.push(
      `// @ts-ignore
${targetExpression}.displayName = ${JSON.stringify(componentDoc.displayName)};`
    );
  }
  statements.push(
    `// @ts-ignore
${targetExpression}.__docgenInfo = ${serializeComponentDoc(componentDoc, options)};`
  );
  return `try {
${indentBlock(statements.join("\n"))}
} catch (__react_docgen_typescript_loader_error) {}`;
}
function generateDocgenCodeBlock(options) {
  const codeBlocks = options.componentDocs.map((componentDoc) => createComponentCode(componentDoc, options)).filter(Boolean).join("\n");
  const code = codeBlocks ? `${options.source}${options.source.endsWith("\n") ? "" : "\n"}${codeBlocks}` : options.source;
  return {
    code,
    map: null
  };
}

export { generateDocgenCodeBlock };
