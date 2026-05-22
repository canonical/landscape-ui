import { useLocation } from "react-router";

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

export default LocationDisplay;
