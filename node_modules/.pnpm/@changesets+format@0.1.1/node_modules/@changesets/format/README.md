# @changesets/format

Detect installed code formatters and format files with them.

## Usage

### `detect()`

<!-- NOTE: Docs should match src/detect.ts -->

Detect the preferred formatter used in the project.

```ts
import { detect } from "@changesets/format";

const result = await detect();
// => "prettier"
```

Options can be passed to the first parameter:

- `cwd`: The current working directory to start looking up for the formatter. Defaults to `process.cwd()`.
- `stopDir`: The path to stop traversing up the directory.
- `order`: The order of formatters to check for. Defaults to `["dprint", "deno", "oxfmt", "biome", "prettier"]` (from `defaultDetectOrder`)

### `format()`

Format the given patterns with a specified or auto-detected formatter. It returns `true` if a formatter is found and the formatting process passes, otherwise returns `false`.

<!-- NOTE: Docs should match src/format.ts -->

```ts
import { format } from "@changesets/format";

await format(["src/index.ts"]);
```

Options can be passed to the second parameter:

- `formatter`: The formatter to use for formatting. It not specified, it will be auto-detected using `detect`. Use `detect` directly if you want to have more control over the detection process.
- `cwd`: The current working directory to start looking up for the formatter and package manager, and to execute the formatter's command from. Defaults to `process.cwd()`.
- `stopDir`: The path to stop traversing up the directory.
- `packageManager`: The package manager to use for executing the formatter's command. If not specified, it will use `package-manager-detector` to detect the package manager.

## License

MIT
