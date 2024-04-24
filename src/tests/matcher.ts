import { within } from "@testing-library/react";
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
  toHaveTexts(received: HTMLElement, texts: string[]) {
    if (undefined === received.textContent) {
      throw new TypeError(
        "toHaveTexts matcher requires a DOM element to be passed.",
      );
    }

    const notFoundTexts = texts.filter(
      (text) => !received.textContent?.includes(text),
    );
    const pass = notFoundTexts.length === 0;

    return {
      pass,
      message: () =>
        pass
          ? `expected ${this.utils.printReceived(received)} not to contain texts ${this.utils.printExpected(notFoundTexts)}`
          : `expected ${this.utils.printReceived(received)} to contain texts ${this.utils.printExpected(notFoundTexts)}`,
    };
  },
  toHaveInputValues(received: HTMLElement, values: string[]) {
    const inputs = Array.from(received.querySelectorAll("input"));
    const inputValues = inputs.map((input) => input.value);
    const notFoundValues = values.filter(
      (value) => !inputValues.includes(value),
    );
    const pass = notFoundValues.length === 0;

    return {
      pass,
      message: () =>
        pass
          ? `expected ${this.utils.printReceived(received)} not to contain input values ${this.utils.printExpected(notFoundValues)}`
          : `expected ${this.utils.printReceived(received)} to contain input values ${this.utils.printExpected(notFoundValues)}`,
    };
  },
  toHaveInfoItem(received: HTMLElement, label: string, value: string) {
    if (value.length > 120) {
      value = value.slice(0, 120) + "...";
    }
    const infoItem = within(received).getByText(label);
    const pass =
      infoItem &&
      infoItem.nextSibling &&
      infoItem.nextSibling.textContent === value;

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(received)} not to contain an item with label "${this.utils.printReceived(label)}" and value "${this.utils.printReceived(value)}"`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(received)} to contain an item with label "${this.utils.printReceived(label)}" and value "${this.utils.printReceived(value)}"`,
        pass: false,
      };
    }
  },
});
