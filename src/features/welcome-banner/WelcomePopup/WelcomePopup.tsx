import { FC, useEffect, useState } from "react";
import WelcomePopupModal from "../WelcomePopupModal";

const WelcomePopup: FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const hideBanner = () => {
    setIsPopupVisible(false);
    localStorage.setItem("_landscape_isWelcomePopupClosed", "true");
  };

  useEffect(() => {
    const isPopupClosed = localStorage.getItem(
      "_landscape_isWelcomePopupClosed",
    );

    setIsPopupVisible(!isPopupClosed);
  }, []);

  return isPopupVisible ? <WelcomePopupModal hideBanner={hideBanner} /> : null;
};

export default WelcomePopup;
