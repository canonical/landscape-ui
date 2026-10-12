import type { FC } from "react";
import { useEffect, useState } from "react";
import WelcomePopupModal from "../WelcomePopupModal";

const WelcomePopup: FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const hideBanner = () => {
    setIsPopupVisible(false);
    localStorage.setItem("_landscape_isDefaultPortalPopupClosed", "true");
  };

  useEffect(() => {
    const isPopupClosed = localStorage.getItem(
      "_landscape_isDefaultPortalPopupClosed",
    );

    setIsPopupVisible(!isPopupClosed);
  }, []);

  return isPopupVisible ? <WelcomePopupModal hideBanner={hideBanner} /> : null;
};

export default WelcomePopup;
