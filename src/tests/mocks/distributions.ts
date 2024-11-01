import { Distribution } from "@/features/mirrors";
import { pockets, pocketsWithoutSnapshot } from "./pockets";

export const distributions: Distribution[] = [
  {
    access_group: "access group 1",
    creation_time: "2021-09-01T00:00:00Z",
    name: "Distribution 1",
    series: [],
  },
  {
    access_group: "access group 2",
    creation_time: "2021-09-02T00:00:00Z",
    name: "Distribution 2",
    series: [
      {
        name: "Series 2",
        creation_time: "",
        pockets: pockets,
      },
    ],
  },
  {
    access_group: "access group 3",
    creation_time: "2021-09-02T00:00:00Z",
    name: "Distribution 3",
    series: [
      {
        name: "Series 3",
        creation_time: "",
        pockets: pocketsWithoutSnapshot,
      },
    ],
  },
];
