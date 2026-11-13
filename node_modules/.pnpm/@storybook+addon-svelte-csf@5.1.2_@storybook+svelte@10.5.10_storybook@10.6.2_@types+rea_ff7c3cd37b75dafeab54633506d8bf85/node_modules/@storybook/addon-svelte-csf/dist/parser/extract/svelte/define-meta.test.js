import { describe, it } from 'vitest';
import { extractDefineMetaPropertiesNodes } from './define-meta.js';
import { getSvelteAST } from '../../ast.js';
import { extractSvelteASTNodes } from './nodes.js';
describe(extractDefineMetaPropertiesNodes.name, () => {
    it('extracts correctly selected properties', async ({ expect }) => {
        const ast = getSvelteAST({
            code: `
        <script module>
          import { defineMeta } from "@storybook/addon-svelte-csf"

          const { Story } = defineMeta({
            title: "My Story",
            id: "custom-id",
            tags: ["autodocs", "!dev"],
          });
        </script>
      `,
        });
        const nodes = await extractSvelteASTNodes({ ast });
        const properties = extractDefineMetaPropertiesNodes({
            nodes,
            properties: ['title', 'id', 'tags', 'args', 'parameters'],
        });
        expect((properties.title?.value).value).toBe('My Story');
        expect((properties.id?.value).value).toBe('custom-id');
        expect((properties.tags?.value).elements[0].value).toBe('autodocs');
        expect((properties.tags?.value).elements[1].value).toBe('!dev');
        expect(properties.args).toBeUndefined();
        expect(properties.parameters).toBeUndefined();
    });
});
