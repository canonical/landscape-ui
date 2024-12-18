import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { usePageParams } from "@/hooks/usePageParams";
import { FC } from "react";

const AutoinstallFilesHeader: FC = () => {
  const { setPageParams } = usePageParams();

  const handleSearch = (searchText: string) => {
    setPageParams({ search: searchText });
  };

  return <HeaderWithSearch onSearch={handleSearch} />;
};

export default AutoinstallFilesHeader;
