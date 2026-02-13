import * as React from 'react';
import { UseTagGroupProps } from '../index.types';
/**
 * Focuses the tag at activeIndex when it changes or when an item is removed.
 */
export declare function useRovingTagFocus(activeIndex: number, itemsLength: number, getTagId: NonNullable<UseTagGroupProps<unknown>['getTagId']>): React.MutableRefObject<Record<string, HTMLElement>>;
