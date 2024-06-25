/* eslint-disable no-console */
// import axios from 'axios';
import { useState, useEffect } from "react";
import * as serviceWorker from "./";

const pushNotificationSupported = serviceWorker.isPushNotificationSupported();
// check push notifications are supported by the browser

export default function usePushNotifications() {
  const [userConsent, setSuserConsent] = useState(Notification.permission);
  const [userSubscription, setUserSubscription] =
    useState<PushSubscription | null>(null);
  const [pushServerSubscriptionId, _setPushServerSubscriptionId] = useState();

  useEffect(() => {
    if (pushNotificationSupported && userSubscription) {
      serviceWorker.askUserPermission();
    }
  }, [userSubscription]);
  useEffect(() => {
    const getExixtingSubscription = async () => {
      const existingSubscription = await serviceWorker.getUserSubscription();
      setUserSubscription(existingSubscription);
    };
    getExixtingSubscription();
  }, []);
  const onClickAskUserPermission = () => {
    serviceWorker.askUserPermission().then((consent) => {
      setSuserConsent(consent);
      if (consent !== "granted") {
        console.log("denied");
      }
    });
  };
  const onClickSusbribeToPushNotification = () => {
    console.log("qweqwewq");

    serviceWorker
      .createNotificationSubscription()
      .then(function (subscrition) {
        console.log("sub ", subscrition);
        console.log(subscrition.getKey("p256dh"));
        console.log(subscrition.getKey("auth"));
        console.log("Subscription JSON:", subscrition.toJSON().keys);
        console.log(subscrition.toJSON());
        setUserSubscription(subscrition);
      })
      .catch((err) => {
        console.error("Couldnt create the notification subscription", err);
      });
  };

  return {
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    pushServerSubscriptionId,
    userConsent,
    pushNotificationSupported,
    userSubscription,
  };
}
