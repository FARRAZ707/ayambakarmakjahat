const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });
const appJson = require("./app.json");

module.exports = () => {
  const googleMapsApiKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
    appJson.expo?.extra?.googleMapsApiKey ||
    appJson.expo?.android?.config?.googleMaps?.apiKey ||
    appJson.expo?.ios?.config?.googleMapsApiKey ||
    "";

  return {
    ...appJson,
    expo: {
      ...appJson.expo,
      android: {
        ...appJson.expo?.android,
        config: {
          ...(appJson.expo?.android?.config || {}),
          googleMaps: {
            ...(appJson.expo?.android?.config?.googleMaps || {}),
            apiKey: googleMapsApiKey,
          },
        },
      },
      ios: {
        ...appJson.expo?.ios,
        config: {
          ...(appJson.expo?.ios?.config || {}),
          googleMapsApiKey: googleMapsApiKey,
        },
      },
      extra: {
        ...appJson.expo?.extra,
        googleMapsApiKey,
      },
    },
  };
};
