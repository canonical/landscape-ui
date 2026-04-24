import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import usePageParams from "@/hooks/usePageParams";

const PublicationsHeader = () => {
  const { query, setPageParams } = usePageParams();

  return (
    <HeaderWithSearch
      searchText={query}
      onSearch={(value) => {
        setPageParams({ query: value });
      }}
    />
  );
};

export default PublicationsHeader;
