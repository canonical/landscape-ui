import { expect } from "vitest";

expect.extend({
  toBeOffScreen(received: HTMLElement) {
    if (undefined === received.classList || undefined === received.style) {
      throw new TypeError(
        "toBeOffScreen matcher requires a DOM element to be passed.",
      );
    }

    const pass =
      received.classList.contains("u-off-screen") ||
      (received.style.height === "1px" &&
        received.style.width === "1px" &&
        received.style.overflow === "hidden" &&
        received.style.position === "absolute");

    return {
      pass,
      message: () =>
        pass
          ? `expected ${this.utils.printReceived(received)} not to be off screen`
          : `expected ${this.utils.printReceived(received)} to be off screen`,
    };
  },
});
