import { ROOT_PATH } from "@/constants";

export const getNavigationLink = (legendItem: string) => {
  switch (legendItem) {
    case "Security":
      return `${ROOT_PATH}instances?status=alert:security-upgrades`;
    case "Regular":
      return `${ROOT_PATH}instances?status=alert:package-upgrades`;
    case "Up to date":
      return `${ROOT_PATH}instances?status=NOT alert:package-upgrades`;
    default:
      return ROOT_PATH;
  }
};
