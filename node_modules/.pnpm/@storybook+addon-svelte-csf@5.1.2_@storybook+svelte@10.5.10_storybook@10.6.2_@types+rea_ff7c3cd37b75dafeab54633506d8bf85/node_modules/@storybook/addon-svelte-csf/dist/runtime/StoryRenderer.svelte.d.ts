import type { Component, Snippet } from 'svelte';
import type { Cmp, StoryContext } from '../types.js';
type Props = {
    Stories: Component;
    exportName: string;
    args: Record<string, any>;
    storyContext: StoryContext<Cmp>;
    metaRenderSnippet?: Snippet;
};
declare const StoryRenderer: Component<Props, {}, "">;
type StoryRenderer = ReturnType<typeof StoryRenderer>;
export default StoryRenderer;
