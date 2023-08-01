import { expect, test } from "@playwright/test";

const TEST_GPG_MATERIAL = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EZMkNDQEEANkInd0n6pbWBfekLL92N3HbLpUZb1Doa64gbEpMbDboE/lzhoA2
Qy44Gy6IzwNs455SqIUxpK5xr1tiRNvLZ6mw7Eobw4RohpH2YRchRq2PQ4fU7Ddh
ditlZuEaeIv0dkLR7nAt0nqErOJo47HzkyaltvBDm9ayOhSODuCuO2fxABEBAAHN
FHRlc3QgPHRlc3RAdGVzdC5jb20+wq0EEwEKABcFAmTJDQ0CGy8DCwkHAxUKCAIe
AQIXgAAKCRCR6geYZwt+FF2DA/9bWVuTd4fS490o+vKXY2ZwV3gq5eQ0xkCLxkg5
PYTmcyisdehWyR1dPKeZ1CvGOMeNI1SbrWn6ATeAyUzokla+Frz1X1aeRP1gTP9v
VMuzOwdATXuTym/DZIaXgHFCP0WD/LdnRI5doc3mWZdpweogCL87BqdqmDUAuDAs
6Z3ATs6NBGTJDQ0BBACy95/1l2t94atIUcMuLpcjJ0iiBu3tTdDs+NVz95gWCeoS
qeg/XSKH8ISi02JCXg9lKwPKOBNWjjxIbeGvnfdlL6cxheHSkwoEBpaBdKiT/Q2L
+MYsZuMORwwCAdWdG4/gdZen8gALtGHbbEmte/l3AKqB23n0GqSJsV5zu/yIkwAR
AQABwsCDBBgBCgAPBQJkyQ0NBQkPCZwAAhsuAKgJEJHqB5hnC34UnSAEGQEKAAYF
AmTJDQ0ACgkQCRAqGzBvfPFHYQP9Fx7WnGq/5/EAh3CE50x54Zu2KQ9N3uo1bc1u
rhzkjwFTgyxn9J7NvNA7mPx7LcdX09HjWyv0q8IV1ztY63bPuiNueAQ8SM5CgKiJ
mc8ZhHGp3QLAFV1etuocijq7xO6tJiD+u/ko+2XNEpvnv+/6gGR+b8pPjqZ5Jzmm
XykfJT3ZQgQAn/zYn1eSqf90lQ/uNgZ7i5ESzE1Xm9KDduFPYEl2rHRCa0yNltzX
LKZyzWED4JFP4U2Idbnh/7UnowErU/JUrOZ2QTjZwzr8u2Ov4KlUWjEcsbzYD33Z
u1XjlWbtNS684dYDCqjwQkUfOTzoeZgE1D/k1bw6zhPDwrIeR3LW6CXOjQRkyQ0N
AQQAt9HFJ67Cehv/hcptXWif5gDz1p3xWE0xLWA/nqoESDMwZ3yyGOhXhaXBGZFa
0KBkM0I6irb4CmKhG1B/peTSwnqpheATAL6bsGKj/ZW3lGt2ELdseEibwVXxlFCP
MuIztnJNDTH1VoB8Tp5GQEXdsjog5WWqOsyq/+YXRenOJSkAEQEAAcLAgwQYAQoA
DwUCZMkNDQUJDwmcAAIbLgCoCRCR6geYZwt+FJ0gBBkBCgAGBQJkyQ0NAAoJEBPv
nhlPPaqnLrgD/0x5g9XwLVNzaqnDcxwEds2/fttvxrbfxjQHN/0gmZjXPD52qrSl
2uIj2W1O9HzKbmcpp/dlkar5Rux/j6I7aL2HEJYqknsomM+hknJmTaryu634aJ3t
c0MhTeyKOLe7VXcELRRMKRrmyeAoLST3qGe/+NWUlHFpma9RrU40aaGJUlsEANdI
SuTHA1k/1sufBSNbwDi4XIQMHo/vgaZ9hGcbqgm0ZIhiDJsSNcjMeIZPvNLTELwp
IdMyYE+IDcdk0ExQt4o65p6aXrSayeu2g5jr/5H44JiXGeMNSb6Mpr/WJ3nNlRmI
zOlMCcVvjVKsUZq2Oi/y/H2awKu5ESkYuhWmWxSj
=9C0g
-----END PGP PUBLIC KEY BLOCK-----
`;

test("should handle GPG key", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "GPG Keys" }).click();
  expect(page.url().includes("gpg-keys")).toBeTruthy();
  await expect(page.getByRole("heading", { name: "GPG Keys" })).toBeVisible();
  await page.getByRole("button", { name: "Import GPG key" }).click();
  await expect(
    page.getByRole("heading", { name: "Import GPG key" })
  ).toBeVisible();
  await page.locator('input[name="name"]').fill("test-gpg-key");
  await page.locator('textarea[name="material"]').fill(TEST_GPG_MATERIAL);
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Import GPG key" })
    .click();

  await expect(page.getByText("test-gpg-key")).toBeVisible();

  const newGpgKeyRow = page
    .getByRole("row")
    .filter({ has: page.getByRole("gridcell", { name: "test-gpg-key" }) });

  await expect(
    newGpgKeyRow.getByRole("gridcell", { name: "Access type" })
  ).toHaveText(/public/i);

  await page
    .getByRole("button", { name: "Remove test-gpg-key GPG key" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Deleting test-gpg-key GPG key" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Are you sure? This action is permanent and can not be undone."
    )
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete test-gpg-key GPG key" })
    .click();

  await expect(newGpgKeyRow).toHaveCount(0);
});
