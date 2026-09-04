import { screen } from "@testing-library/react";
import type { FC } from "react";
import { useLocation } from "react-router";

export const LOCATION_TEST_ID = "location-display";

export const LocationDisplay: FC = () => {
  const { pathname, search } = useLocation();

  return <div data-testid={LOCATION_TEST_ID}>{`${pathname}${search}`}</div>;
};

export const getLocationDisplay = (): HTMLElement =>
  screen.getByTestId(LOCATION_TEST_ID);
