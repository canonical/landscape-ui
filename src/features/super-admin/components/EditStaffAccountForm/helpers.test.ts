import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { createStaffAccounts } from "@/tests/mocks/staffAccounts";
import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import {
  describeChanges,
  formatAttachmentSize,
  getChanges,
  getFieldErrors,
  getInitialValues,
} from "./helpers";

const [staffAccount] = createStaffAccounts();

const NEW_LIMIT = 25;
const KIBIBYTE = 1024;

const getRejection = (data: unknown): AxiosError =>
  new AxiosError("Bad request", "ERR_BAD_REQUEST", undefined, undefined, {
    data,
    status: 400,
    statusText: "Bad Request",
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe("EditStaffAccountForm helpers", () => {
  assert(staffAccount);

  const initialValues = getInitialValues(staffAccount);

  describe("getChanges", () => {
    it("is empty when nothing changed", () => {
      expect(getChanges(initialValues, staffAccount)).toEqual({});
    });

    it("ignores surrounding whitespace in text fields", () => {
      expect(
        getChanges(
          {
            ...initialValues,
            subdomain: ` ${staffAccount.subdomain} `,
            salesforce_account_key: ` ${staffAccount.salesforce_account_key} `,
          },
          staffAccount,
        ),
      ).toEqual({});
    });

    it("has only the fields that changed", () => {
      expect(
        getChanges(
          { ...initialValues, max_people_count: NEW_LIMIT },
          staffAccount,
        ),
      ).toEqual({ max_people_count: NEW_LIMIT });
    });

    it("clears an emptied text field with null", () => {
      expect(
        getChanges(
          { ...initialValues, subdomain: "", salesforce_account_key: "  " },
          staffAccount,
        ),
      ).toEqual({ subdomain: null, salesforce_account_key: null });
    });

    it("leaves an emptied number field out", () => {
      expect(
        getChanges(
          { ...initialValues, max_people_count: "", max_attachment_size: "" },
          staffAccount,
        ),
      ).toEqual({});
    });
  });

  describe("describeChanges", () => {
    it("describes each change with its old and new value", () => {
      expect(
        describeChanges(
          {
            subdomain: null,
            salesforce_account_key: "1-001NEWKEY000000",
            max_people_count: NEW_LIMIT,
            max_attachment_size: KIBIBYTE,
          },
          staffAccount,
        ),
      ).toEqual([
        {
          label: "Subdomain",
          from: staffAccount.subdomain,
          to: NO_DATA_TEXT,
        },
        {
          label: "Salesforce account key",
          from: staffAccount.salesforce_account_key,
          to: "1-001NEWKEY000000",
        },
        {
          label: "Administrator limit",
          from: String(staffAccount.max_people_count),
          to: String(NEW_LIMIT),
        },
        {
          label: "Attachment size limit",
          from: formatAttachmentSize(staffAccount.max_attachment_size),
          to: "1,024 bytes",
        },
      ]);
    });
  });

  describe("getFieldErrors", () => {
    it("maps validation errors to the fields they name", () => {
      expect(
        getFieldErrors(
          getRejection({
            error: "PydanticValidationError",
            message: "invalid query/body arguments",
            detail: [
              { loc: ["body", "subdomain"], msg: "String too short" },
              { loc: ["max_people_count"], msg: "Too large" },
              { loc: ["unknown_field"], msg: "Ignored" },
            ],
          }),
        ),
      ).toEqual({
        subdomain: "String too short",
        max_people_count: "Too large",
      });
    });

    it("maps a Salesforce key rejection to its field", () => {
      expect(
        getFieldErrors(
          getRejection({
            error: "ApiRequestError",
            message:
              "Salesforce account key is already used by account ACME Corp (acme) ",
            detail: null,
          }),
        ),
      ).toEqual({
        salesforce_account_key:
          "Salesforce account key is already used by account ACME Corp (acme)",
      });
    });

    it("maps a subdomain rejection to its field", () => {
      expect(
        getFieldErrors(
          getRejection({
            error: "ApiRequestError",
            message: "Cannot set subdomain to any of '['landscape', 'saas']'",
            detail: null,
          }),
        ),
      ).toEqual({
        subdomain: "Cannot set subdomain to any of '['landscape', 'saas']'",
      });
    });

    it("is empty for an error that names no field", () => {
      expect(
        getFieldErrors(
          getRejection({ error: "UnauthorizedAccess", message: "Forbidden" }),
        ),
      ).toEqual({});
      expect(getFieldErrors(new Error("Network down"))).toEqual({});
    });
  });
});
