import { API_URL } from "@/constants";
import useEnv from "@/hooks/useEnv";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { FC } from "react";
import { describe, expect, it } from "vitest";

const EnvDisplay: FC = () => {
  const { envLoading, isSaas } = useEnv();

  return <p>{envLoading ? "loading" : `settled, saas: ${isSaas}`}</p>;
};

describe("EnvProvider", () => {
  it("settles as neither mode when the deployment cannot be read", async () => {
    server.use(
      http.get(`${API_URL}about`, () =>
        HttpResponse.json({ error: "ServerError" }, { status: 500 }),
      ),
    );

    renderWithProviders(<EnvDisplay />);

    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(await screen.findByText("settled, saas: false")).toBeInTheDocument();
  });
});
