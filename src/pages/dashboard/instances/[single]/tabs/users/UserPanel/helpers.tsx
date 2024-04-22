import { User } from "@/types/User";

export const getFilteredUsers = (searchText: string, users: User[]) => {
  return searchText
    ? users.filter(({ username, name }) => {
        const nameMatches = name
          ?.toUpperCase()
          .includes(searchText.toUpperCase());
        const usernameMatches = username
          .toUpperCase()
          .includes(searchText.toUpperCase());
        return nameMatches || usernameMatches;
      })
    : users;
};
