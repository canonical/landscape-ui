import { FC } from "react";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { usePageParams } from "@/hooks/usePageParams";

interface WslProfilesHeaderProps {}

const WslProfilesHeader: FC<WslProfilesHeaderProps> = () => {
  const { setPageParams } = usePageParams();

  const handleSearch = (searchText: string) => {
    setPageParams({ search: searchText });
  };

  return <HeaderWithSearch onSearch={handleSearch} />;
};

export default WslProfilesHeader;
