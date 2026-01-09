import type { Invitation, InvitationSummary } from "@/types/Invitation";

export const invitations: Invitation[] = [
  {
    id: 3,
    secure_id: "FYrgMkfjbsjR7uyMz6bdFaaMK1Za",
    account: "Onward, Inc",
    name: "Ben Junior",
    email: "ben@example.com",
    creation_time: "2023-11-29T18:31:16Z",
  },
  {
    id: 6,
    secure_id: "k5ceAFWrbbbi2gMYZE4n1BlHQaO",
    account: "Onward, Inc",
    name: "Billing-1",
    email: "billing@acme.org",
    creation_time: "2024-04-08T14:56:36Z",
  },
  {
    id: 4,
    secure_id: "ZyuSN7HiEjasdasdX41gSkB4v4ZH",
    account: "Onward, Inc",
    name: "Hans",
    email: "hans@camomical.com",
    creation_time: "2024-04-02T07:25:51Z",
  },
  {
    id: 8,
    secure_id: "35Nc8312bPgIqF9zUEe9c71SP96",
    account: "Onward, Inc",
    name: "John Sample",
    email: "example@landscape.com",
    creation_time: "2024-04-15T14:25:13Z",
  },
  {
    id: 7,
    secure_id: "THyoWWtlH1241AGePxFZj4cvvx",
    account: "Onward, Inc",
    name: "Lorem Ipsum",
    email: "lorem-ipsum@typeface.com",
    creation_time: "2024-04-11T13:43:37Z",
  },
  {
    id: 14,
    secure_id: "B9cccx16XndXKE12wcrJprwECK",
    account: "Onward, Inc",
    name: "Tasty",
    email: "tasty@test.com",
    creation_time: "2024-05-03T09:12:24Z",
  },
  {
    id: 9,
    secure_id: "xep8dt2t5612GpAzxcGVH3KZN",
    account: "Onward, Inc",
    name: "Test Engineer",
    email: "null@example.com",
    creation_time: "2024-04-15T15:28:20Z",
  },
  {
    id: 10,
    secure_id: "j6rojiN12cczbNaMAHtvi29XDssg",
    account: "Onward, Inc",
    name: "kasgkjhas",
    email: "oiwehfo@kjsagfdk.COM",
    creation_time: "2024-04-16T10:10:30Z",
  },
  {
    id: 11,
    secure_id: "m9dOtS1YkJuK516sVnzZp8",
    account: "Onward, Inc",
    name: "kjbkjb",
    email: "jklbkjn@jkkjbk.com",
    creation_time: "2024-04-18T09:40:41Z",
  },
  {
    id: 5,
    secure_id: "gCNrdxPec6U4v516kFqfnXuu7sM",
    account: "Onward, Inc",
    name: "test",
    email: "test@test.com",
    creation_time: "2024-04-02T08:56:24Z",
  },
  {
    id: 12,
    secure_id: "cbJXG1231zxgh2VJqypO498I4Ikhq",
    account: "Onward, Inc",
    name: "testeer",
    email: "jklkjn@jkkjbk.com",
    creation_time: "2024-04-18T09:41:34Z",
  },
];

export const invitationsSummary = [
  {
    account_title: "Onward, Inc.",
    secure_id: "1",
  },
  {
    account_title: "Onward, Inc.",
    secure_id: "2",
  },
  {
    account_title: "Onward, Inc.",
    secure_id: "3",
  },
] as const satisfies InvitationSummary[];
