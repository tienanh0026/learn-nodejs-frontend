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
    serviceWorker
      .createNotificationSubscription()
      .then(function (subscrition) {
        console.log("sub ", subscrition);
        console.log(subscrition.getKey("p256dh"));
        console.log(subscrition.getKey("auth"));
        console.log(subscrition.toJSON());
        setUserSubscription(subscrition);
      })
      .catch((err) => {
        console.error("Couldnt create the notification subscription", err);
      });
  };
  const onClickSendSubscriptionToPushServer = () => {
    // axios
    //   .post('http://localhost:4000/subscription', { data: userSubscription })
    //   .then(function (response) {
    //     setPushServerSubscriptionId(response.data.id);
    //     setLoading(false);
    //   })
    //   .catch((_err) => {
    //     setLoading(false);
    //   });
  };
  const onClickSendNotification = async () => {
    // setLoading(true);
    // axios.get(`http://localhost:4000/subscription/${pushServerSubscriptionId}`).catch((_error) => {
    //   setLoading(false);
    // });
    // setLoading(false);
  };

  return {
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
    userConsent,
    pushNotificationSupported,
    userSubscription,
  };
}
