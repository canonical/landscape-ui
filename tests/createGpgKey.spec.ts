import { expect, test } from "@playwright/test";

const TEST_GPG_MATERIAL = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EZWnlbQEEALR/vsh3KYHFuy3PvUEZ6IcpWQ+LdVA/DnbuPEoKSC5JwTDXxKUh
8IlCdwpX/U8EIR2Ky4mn2urGnga7mL2MNqYICVfr0Ixh3YtH2EcL9zm1MAEXX6Vk
72dINmY/07GRilCflwiU3wSd0Q/Bl75Pl+YgV9FCwYGEcb16i4KukaULABEBAAHN
KUpvaG4gU21pdGggPHl1cmlpLnZhc3lsaWV2QGNhbm9uaWNhbC5jb20+wq0EEwEK
ABcFAmVp5W0CGy8DCwkHAxUKCAIeAQIXgAAKCRAu1QbnpCpmwfHpA/4xgtpuE4vg
5D18df/B29l4TLDrcsMkR0AbaEms4+leGPhWE+XVjPRDDs1j6ky/Z0+87Y2WIddh
WhuTO1ssJtQk3qEKWkg5nJlN1I2l7J2YyKp7y4aMlAkeU8Kk/tV7IeRQD8sNmw4R
ep31bKr3/CNq0VLjbMKXcIkAFZztiN6w2c6NBGVp5W0BBADPxzB2xq71c1NRxUQM
u4RWzQK9N1qfthBJu4pdCBz+j50icDKLaw3jhDWCPZJzlnCQSYPDsk+dTjEnby8V
IBOxX6bkEfdtmYOLbETYt0wKYrMUsQ1dBRITFjCLQQVDxAVEp5N2PrIR6pzjzBq3
SU5ZQuOTfij5WkkD5rTl1AH8SwARAQABwsCDBBgBCgAPBQJlaeVtBQkPCZwAAhsu
AKgJEC7VBuekKmbBnSAEGQEKAAYFAmVp5W0ACgkQ5DBXqh4dnsG8NQP7Be3z87fC
/RpUa0SuIPouQR0j06vOiEf68H/b+FrIV7EpTtuiTnKCTOACdkijvPDYqARSK7mH
L3RP/HjHR8Ir1phK+sHNt/6j09Vsg92di0nUuUQ9oGRNlUgPExwPtiMNuNEsmdto
ESl1Ie/za5Df7BKNdJo1Xp0L6G17b0ldWHKSdAP9Ee8C6IvCJwvCLJZCGfhJoQr/
qgiwK/57Ja3rX+kpgbnIpAleGRm2Pvdu0XJAe/1P0hx/7dAu8htanXzAdSyDMnLX
UfwIaZugxeRpliVWpcZIvCimIa83PkwMaNfrO0qSA4Auq/r5Ld+h4qPE9luxessw
09Kq8B2Z3394aXa0Cj/OjQRlaeVtAQQAt2z2y/ULtwzA2K/7bFBgmqccyADM7URR
BTfPzfa7o4yxd/I9S8ig83knlOG8+PodB+wgEJDlqte6PmCOH0DaSF/iPCQVMi+p
ToVXZjy911Yv7UPtC/N5/q27saF9Y1PKqeIIxVEDx3zBc4o+/pwQmZSV7wJ3S7wZ
+Sj0yDUQCYcAEQEAAcLAgwQYAQoADwUCZWnlbQUJDwmcAAIbLgCoCRAu1QbnpCpm
wZ0gBBkBCgAGBQJlaeVtAAoJEMSVhEO6s7Oy7fwD/2cYtg21BwUPPP96PFpP7bcj
y3lY4pRAS3IQWGiHSvrh8FS1LuXSPuznKnLVYiFaPDgZSEOoxTcCefN9DvggE8wg
xazzb8W8WUEX8zWOaSvEZe4Y/9a5FeuHQzs5SanTUzRgkA2i2aBM2mX/HZhwROWS
LXPcBN77jRzyZHFc1+hfPa0EAKp6oKrQK+kxhqUoDc2fIVZrXpfS/lFXgvskGU+0
fDGQ7VSFX12bLi67diFKp3HnmYg5D/pjZC6Y30cMG+VoOTLIucuKCx1IFfYgdIeY
Wch3hvQk5/ueMSsJGOhOR89XIDEoXWeSRSuRadAeuIsGVN3P1HVSyAwl1BFbSpwz
63b2
=NKCM
-----END PGP PUBLIC KEY BLOCK-----
`;

test("should handle GPG key", async ({ page }) => {
  await page.goto("/repositories/mirrors");

  await page.getByRole("link", { name: "GPG Keys" }).click();
  expect(page.url().includes("gpg-keys")).toBeTruthy();
  await expect(page.getByRole("heading", { name: "GPG Keys" })).toBeVisible();
  await page.getByRole("button", { name: "Import GPG key" }).click();
  await expect(
    page.getByRole("heading", { name: "Import GPG key" }),
  ).toBeVisible();
  await page.locator('input[name="name"]').fill("test-e2e-gpg-key");
  await page.locator('textarea[name="material"]').fill(TEST_GPG_MATERIAL);
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Import key" })
    .click();

  await expect(
    page.getByText("test-e2e-gpg-key", { exact: true }),
  ).toBeVisible();

  const newGpgKeyRow = page
    .getByRole("row")
    .filter({ has: page.getByRole("rowheader", { name: "test-e2e-gpg-key" }) });

  await expect(newGpgKeyRow).toHaveCount(1);
  await expect(newGpgKeyRow.getByLabel("Access type")).toHaveText(/public/i);
});
