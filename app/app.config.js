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
  },
}
