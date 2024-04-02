import { ROOT_PATH } from "@/constants";

export const getNavigationLink = (legendItem: string) => {
  switch (legendItem) {
    case "Security":
      return `${ROOT_PATH}instances?status=security-upgrades`;
    case "Regular":
      return `${ROOT_PATH}instances?status=package-upgrades`;
    case "Up to date":
      return `${ROOT_PATH}instances?status=up-to-date`;
    default:
      return ROOT_PATH;
  }
};
