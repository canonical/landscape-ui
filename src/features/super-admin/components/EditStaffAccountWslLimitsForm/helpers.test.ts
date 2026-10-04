import { defaultWslFeatureLimits } from "@/tests/mocks/staffAccounts";
import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { describeChanges, getFieldErrors, getLimits } from "./helpers";

const NEW_LIMIT = 25;

const getRejection = (data: unknown): AxiosError =>
  new AxiosError("Bad request", "ERR_BAD_REQUEST", undefined, undefined, {
    data,
    status: 400,
    statusText: "Bad Request",
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe("EditStaffAccountWslLimitsForm helpers", () => {
  describe("getLimits", () => {
    it("returns every limit when the form is complete", () => {
      expect(getLimits(defaultWslFeatureLimits)).toEqual(
        defaultWslFeatureLimits,
      );
    });

    it("is null while a field is empty", () => {
      expect(
        getLimits({
          ...defaultWslFeatureLimits,
          max_wsl_child_instances_per_host: "",
        }),
      ).toBeNull();
    });
  });

  describe("describeChanges", () => {
    it("is empty when nothing changed", () => {
      expect(
        describeChanges(defaultWslFeatureLimits, defaultWslFeatureLimits),
      ).toEqual([]);
    });

    it("describes only the limits that changed", () => {
      expect(
        describeChanges(
          {
            ...defaultWslFeatureLimits,
            max_wsl_child_instance_profiles: NEW_LIMIT,
          },
          defaultWslFeatureLimits,
        ),
      ).toEqual([
        {
          label: "WSL instance profiles",
          from: defaultWslFeatureLimits.max_wsl_child_instance_profiles,
          to: NEW_LIMIT,
        },
      ]);
    });
  });

  describe("getFieldErrors", () => {
    it("maps validation errors to the limits they name", () => {
      expect(
        getFieldErrors(
          getRejection({
            error: "PydanticValidationError",
            message: "invalid query/body arguments",
            detail: [
              {
                loc: ["body", "max_windows_host_machines"],
                msg: "Input should be a valid integer",
              },
              { loc: ["unknown_field"], msg: "Ignored" },
            ],
          }),
        ),
      ).toEqual({
        max_windows_host_machines: "Input should be a valid integer",
      });
    });

    it("is empty for any other error", () => {
      expect(
        getFieldErrors(
          getRejection({ error: "NotFound", message: "Not found" }),
        ),
      ).toEqual({});
      expect(getFieldErrors(new Error("Network error"))).toEqual({});
    });
  });
});
