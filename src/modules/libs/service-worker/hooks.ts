import { useEffect } from "react";
import * as serviceWorker from "./";

const isBrowserSupportServiceWorker =
  serviceWorker.isPushNotificationSupported();

const usePushNotification = () => {
  useEffect(() => {
    if (isBrowserSupportServiceWorker) {
      // registerSW({
      //     onNeedRefresh() {},
      //     onOfflineReady() {},
      //   })
        serviceWorker.askForPermission();
    }
  }, []);
};

export default usePushNotification;
