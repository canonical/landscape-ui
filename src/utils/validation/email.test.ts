import { describe, expect, it } from "vitest";
import {
  basicEmailSchema,
  EMAIL_ERROR_MESSAGE,
  emailSchema,
  isValidEmail,
  normalizeEmail,
} from "./email";

const LOCAL_PART_MAX_LENGTH = 64;
const DNS_LABEL_MAX_LENGTH = 63;
const EMAIL_MAX_LENGTH = 254;
const MAX_TEST_NAME_LENGTH = 40;

const LONG_LABEL = "a".repeat(DNS_LABEL_MAX_LENGTH);

const addressOfLength = (length: number) => {
  const prefix = `u@${LONG_LABEL}.${LONG_LABEL}.${LONG_LABEL}.`;

  return prefix + "a".repeat(length - prefix.length);
};

// Expected results were produced by landscape-server's pydantic EmailStr
// (pydantic 2.4.2, email-validator 2.2.0, idna 3.11). Re-check them against the
// server when those versions change.
const SERVER_ACCEPTED = [
  "user+tag@example.com",
  "o'brien@example.com",
  "a!#$%&'*+/=?^_`{|}~-@example.com",
  "first.last@sub.example.co.uk",
  "用户@例子.广告",
  "user@xn--fsqu00a.xn--3lr804guic",
  "a".repeat(LOCAL_PART_MAX_LENGTH) + "@example.com",
  "é".repeat(LOCAL_PART_MAX_LENGTH) + "@example.com",
  addressOfLength(EMAIL_MAX_LENGTH),
  `u@${LONG_LABEL}.com`,
  "a@b.co",
  "a@b.c",
  "A@B.COM",
  "_@example.com",
  "+@example.com",
  "~@example.com",
  "a@example.c0m",
  "a@123.com",
  "a@exa--mple.com",
  "a@xn--mple.com",
  "a@a--b.com",
  "a@test.com",
  "a@x.mytest",
  "a@localhost.com",
  "a@example.example",
  "a@example.internal",
  // KELVIN SIGN maps to "k", so this is not the special-use "local".
  "a@example.\u{212a}ocal",
  "é@example.com",
  "e\u{301}@example.com",
  "😀@example.com",
  "ａ@example.com",
  "a@example。com",
  "a@例子.广告",
  "a@münchen.de",
  "a@MÜNCHEN.DE",
  "a@straße.de",
  "a@σας.gr",
  "a@l·l.com",
  "a@ẞ.com",
  "a@xn--caf-dma.com",
  "a@例子.1广告",
  " a@example.com",
  "\ta@example.com\n",
  "\u{3000}a@example.com\u{3000}",
];

const SERVER_REJECTED = [
  ".user@example.com",
  "user.@example.com",
  "us..er@example.com",
  '"quoted"@example.com',
  "user@[127.0.0.1]",
  "user@localhost",
  "user@example",
  "user@example.local",
  "user@-example.com",
  "user@example.123",
  "a".repeat(LOCAL_PART_MAX_LENGTH + 1) + "@example.com",
  "é".repeat(LOCAL_PART_MAX_LENGTH + 1) + "@example.com",
  // 64 characters, but over the 254-octet limit once UTF-8 encoded.
  "😀".repeat(LOCAL_PART_MAX_LENGTH) + "@example.com",
  addressOfLength(EMAIL_MAX_LENGTH + 1),
  `u@${LONG_LABEL}a.com`,
  "a b@example.com",
  "a,b@example.com",
  "a\\b@example.com",
  "a<b@example.com",
  "a\u{0}b@example.com",
  "a\u{7f}b@example.com",
  "@example.com",
  "a@",
  "a@@example.com",
  "a..b@example.com",
  '"a b"@example.com',
  "a@[1.2.3.4]",
  "a@[IPv6:::1]",
  "a@example.com.",
  "a@.example.com",
  "a@example..com",
  "a@exa_mple.com",
  "a@example.com1",
  "a@1.2.3.4",
  "a@-example.com",
  "a@example-.com",
  "a@ex--ample.com",
  "a@xn--.com",
  "a@xn--3lr804guic",
  "a@ab--c.com",
  "a@example.test",
  "a@foo.test",
  "a@mytest",
  "a@example.local",
  "a@example.onion",
  "a@in-addr.arpa",
  "a@EXAMPLE.LOCAL",
  "a@example.ｔｅｓｔ",
  "\u{301}e@example.com",
  "用户..用户@example.com",
  "\u{200d}@example.com",
  "a\u{200b}b@example.com",
  "a\u{a0}b@example.com",
  "a\u{202e}b@example.com",
  "a\u{e000}b@example.com",
  "a\u{feff}b@example.com",
  "a\u{d800}b@example.com",
  "ａ＠example.com",
  "a@ex\u{ad}ample.com",
  "a@ex\u{200b}ample.com",
  "a@\u{300}a.com",
  "a@\u{a0}.com",
  "a@xn--a-.com",
  "a@例子.1",
  "\u{feff}a@example.com",
  "\u{200b}a@example.com",
  "a @example.com",
  "  ",
];

// The server accepts these and stores only the address; the client rejects
// them on purpose.
const PRETTY_NAMES = [
  "John Doe <john@example.com>",
  "<john@example.com>",
  '"John Doe" <john@example.com>',
];

const withTestName = (addresses: string[]) =>
  addresses.map((address) => {
    const shown = JSON.stringify(address.slice(0, MAX_TEST_NAME_LENGTH));

    return [
      address.length > MAX_TEST_NAME_LENGTH
        ? `${shown}… (${address.length} chars)`
        : shown,
      address,
    ] as const;
  });

describe("isValidEmail", () => {
  it.each(withTestName(SERVER_ACCEPTED))(
    "accepts %s like the server",
    (_name, address) => {
      expect(isValidEmail(address)).toBe(true);
    },
  );

  it.each(withTestName(SERVER_REJECTED))(
    "rejects %s like the server",
    (_name, address) => {
      expect(isValidEmail(address)).toBe(false);
    },
  );

  it.each(withTestName(PRETTY_NAMES))(
    "rejects the pretty-name form %s",
    (_name, address) => {
      expect(isValidEmail(address)).toBe(false);
    },
  );
});

describe("emailSchema", () => {
  it("accepts plus-addressed emails", async () => {
    await expect(emailSchema().isValid("user+tag@example.com")).resolves.toBe(
      true,
    );
  });

  it("reports the shared message for invalid emails", async () => {
    await expect(emailSchema().validate("invalid-email")).rejects.toThrow(
      EMAIL_ERROR_MESSAGE,
    );
    expect(EMAIL_ERROR_MESSAGE).toBe("Please provide a valid email address");
  });

  it("leaves empty values to required()", async () => {
    await expect(emailSchema().isValid("")).resolves.toBe(true);
    await expect(emailSchema().required().isValid("")).resolves.toBe(false);
  });
});

describe("normalizeEmail", () => {
  it.each([
    [" user@example.com\n", "user@example.com"],
    ["User@EXAMPLE.COM", "User@example.com"],
    ["cafe\u0301@example.com", "caf\u00e9@example.com"],
    ["a@\u03a3\u0391\u03a3.gr", "a@\u03c3\u03b1\u03c3.gr"],
    ["not-an-email", "not-an-email"],
  ])("normalizes %j", (value, expected) => {
    expect(normalizeEmail(value)).toBe(expected);
  });
});

describe("basicEmailSchema", () => {
  it.each(["admin@corp.local", " user@example.com ", "user+tag@example.com"])(
    "accepts %j",
    (value) => {
      expect(basicEmailSchema().isValidSync(value)).toBe(true);
    },
  );

  it.each(["testinputvalue", "a b@example.com", "@example.com", "user@"])(
    "rejects %j",
    (value) => {
      expect(basicEmailSchema().isValidSync(value)).toBe(false);
    },
  );
});
