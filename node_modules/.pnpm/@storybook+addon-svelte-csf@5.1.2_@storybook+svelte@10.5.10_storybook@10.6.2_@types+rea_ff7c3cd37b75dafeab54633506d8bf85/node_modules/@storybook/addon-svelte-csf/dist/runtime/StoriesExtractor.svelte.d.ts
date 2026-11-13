import type { Component } from 'svelte';
import type { Cmp } from '../types.js';
import { type StoriesRepository } from './contexts/extractor.svelte';
interface Props {
    Stories: Component;
    repository: () => StoriesRepository<Cmp>;
}
declare const StoriesExtractor: Component<Props, {}, "">;
type StoriesExtractor = ReturnType<typeof StoriesExtractor>;
export default StoriesExtractor;
