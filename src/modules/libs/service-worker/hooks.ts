import { useEffect } from "react";
import * as serviceWorker from "./";
import { useRegisterSW } from "virtual:pwa-register/react";

const isBrowserSupportServiceWorker =
  serviceWorker.isPushNotificationSupported();

const usePushNotification = () => {
  useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });
  useEffect(() => {
    if (isBrowserSupportServiceWorker) {
      // registerSW({
      //     onNeedRefresh() {},
      //     onOfflineReady() {},
      //   })
      //   serviceWorker.askForPermission();
    }
  }, []);
};

export default usePushNotification;
