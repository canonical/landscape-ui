import type { AccessGroup } from "@/features/access-groups";

export const accessGroups: AccessGroup[] = [
  {
    name: "global",
    title: "Global access",
    parent: "",
    children: "desktop,server,test,windows-xp",
  },
  {
    name: "server",
    title: "Server machines",
    parent: "global",
    children: "",
  },
  {
    name: "desktop",
    title: "Desktop machines",
    parent: "global",
    children: "",
  },
  {
    name: "test",
    title: "test",
    parent: "global",
    children: "sub-test",
  },
  {
    name: "windows-xp",
    title: "Windows XP",
    parent: "global",
    children: "",
  },
  {
    name: "sub-test",
    title: "sub test",
    parent: "test",
    children: "sub-sub-test",
  },
  {
    name: "sub-sub-test",
    title: "sub sub test",
    parent: "sub-test",
    children: "",
  },
  {
    name: "singular-access-group",
    title: "Singular Instance",
    parent: "global",
    children: "",
  },
  {
    name: "empty-access-group",
    title: "Empty Instances",
    parent: "global",
    children: "",
  },
];
