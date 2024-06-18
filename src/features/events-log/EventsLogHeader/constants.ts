import { ListFilter } from "@/types/Filters";

interface EventsFilter {
  days: ListFilter;
}

export const FILTERS: EventsFilter = {
  days: {
    slug: "days",
    label: "Days",
    type: "select",
    options: [
      {
        label: "1 day",
        value: "1",
      },
      {
        label: "7 days",
        value: "7",
      },
      {
        label: "30 days",
        value: "30",
      },
      {
        label: "90 days",
        value: "90",
      },
      {
        label: "180 days",
        value: "180",
      },
      {
        label: "365 days",
        value: "365",
      },
    ],
  },
};
