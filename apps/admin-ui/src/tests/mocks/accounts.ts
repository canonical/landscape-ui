import type { Account } from "@/features/auth";

export const accountsDefault: Account[] = [
  {
    default: true,
    name: "non-subdomain-test-account",
    title: "non-subdomain-test-account",
    subdomain: null,
    classic_dashboard_url:
      "http://landscape.yuriy.works/account/non-subdomain-test-account",
  },
  {
    default: false,
    name: "onward",
    title: "Onward, Inc",
    subdomain: "onward",
    classic_dashboard_url: "http://onward.landscape.yuriy.works/account/onward",
  },
  {
    default: false,
    name: "upside",
    title: "Upside Software, Ltd.",
    subdomain: null,
    classic_dashboard_url: "http://landscape.yuriy.works/account/upside",
  },
];

export const accountsForSubdomain: Account[] = [
  {
    default: false,
    name: "non-subdomain-test-account",
    title: "non-subdomain-test-account",
    subdomain: null,
    classic_dashboard_url:
      "http://landscape.yuriy.works/account/non-subdomain-test-account",
  },
  {
    default: true,
    name: "onward",
    title: "Onward, Inc",
    subdomain: "onward",
    classic_dashboard_url: "http://onward.landscape.yuriy.works/account/onward",
  },
  {
    default: false,
    name: "upside",
    title: "Upside Software, Ltd.",
    subdomain: null,
    classic_dashboard_url: "http://landscape.yuriy.works/account/upside",
  },
];
