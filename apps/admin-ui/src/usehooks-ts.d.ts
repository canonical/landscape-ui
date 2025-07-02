// Temporary fix for React 19 until usehooks-ts@3.2.0 is released
import "usehooks-ts";
import type { RefObject } from "react";

declare module "usehooks-ts" {
  export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: MouseEvent | TouchEvent) => void,
    eventType?: keyof DocumentEventMap,
    options?: boolean | AddEventListenerOptions,
  ): void;
}
