import "dotenv/config"

export default {
  expo: {
    scheme: "acme",
    web: {
      bundler: "metro",
    },
    
    android: {
      softwareKeyboardLayoutMode: "pan",
      adaptiveIcon: {
        foregroundImage: "./assets/Images/adaptive-icon.png",
      },
    },
    name: "app",
    slug: "app",
    icon: "./assets/Images/icon.png",
    extra: {
      eas: {
        projectId: "45684598-8866-4002-9905-6424d49caeb1",
      },
    },
    extras: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    },
  },
}
