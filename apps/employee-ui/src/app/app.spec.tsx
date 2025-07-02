import { render } from "@testing-library/react";

import { BrowserRouter } from "react-router";

import App from "./app";

describe("App", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(baseElement).toBeTruthy();
  });

  it("should have a greeting as the title", () => {
    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(getByText(/Welcome employee-ui/gi)).toBeTruthy();
  });
});
