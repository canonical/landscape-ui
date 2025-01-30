import type { FC } from "react";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import usePageParams from "@/hooks/usePageParams";

const WslProfilesHeader: FC = () => {
  const { setPageParams } = usePageParams();

  const handleSearch = (searchText: string) => {
    setPageParams({ search: searchText });
  };

  return <HeaderWithSearch onSearch={handleSearch} />;
};

export default WslProfilesHeader;
