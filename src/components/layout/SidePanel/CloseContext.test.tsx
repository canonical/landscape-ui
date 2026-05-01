import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CloseContext from "./CloseContext";
import { useContext } from "react";

const TestConsumer = () => {
  const close = useContext(CloseContext);
  return (
    <button onClick={close} data-testid="close-btn">
      close
    </button>
  );
};

describe("CloseContext", () => {
  it("provides default no-op function from context", () => {
    render(<TestConsumer />);

    const btn = screen.getByTestId("close-btn");
    // Should not throw when clicked (default noop)
    expect(() => {
      btn.click();
    }).not.toThrow();
  });

  it("provides a custom function via Provider", () => {
    let called = false;
    const customClose = () => {
      called = true;
    };

    render(
      <CloseContext.Provider value={customClose}>
        <TestConsumer />
      </CloseContext.Provider>,
    );

    screen.getByTestId("close-btn").click();
    expect(called).toBe(true);
  });
});
