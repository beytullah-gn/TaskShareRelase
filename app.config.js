import { config } from 'dotenv';
config(); // dotenv paketini yükleyin ve .env dosyasını okuyun

export default {
  expo: {
    name: 'TaskShare',
    slug: 'TaskShare',
    version: '1.0.0',
    extra: {
      TRANSLATE_API_KEY: process.env.TRANSLATE_API_KEY,
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      databaseURL: process.env.databaseURL,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
      measurementId: process.env.measurementId,
      uri: process.env.uri,
      ip_geo_api: process.env.ip_geo_api
    },
    // diğer konfigürasyonlar
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.TRANSLATE_API_KEY, // örnek olarak Google Maps API anahtarını ekleyebilirsiniz
      },
    },
  },
  
};
