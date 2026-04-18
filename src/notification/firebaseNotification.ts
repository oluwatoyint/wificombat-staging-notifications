const admin = require("firebase-admin");

// Initialize Firebase using environment variables instead of JSON file
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const sendNotif = async (token: string, title: string = "New message", body: string = "Welcome to Traca", payload: { [key: string]: any } = {}) => {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Invalid FCM token provided");
    }
    const message = {
      notification: { title, body },
      android: {
        notification: { sound: "default" },
        data: { title, body, payload: JSON.stringify(payload) }
      },
      apns: {
        payload: {
          aps: { sound: "default", alert: { title, body } },
          customData: { title, body, payload: JSON.stringify(payload) }
        },
        fcm_options: { analytics_label: "apns_label" },
      },
      webpush: {
        headers: { TTL: "4500" },
        notification: { title, body },
        data: { title, body, payload: JSON.stringify(payload) }
      },
      data: { title, body, payload: JSON.stringify(payload) },
      token,
    };
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error: any) {
    console.error("Error sending notification:", error);
    throw error;
  }
};
