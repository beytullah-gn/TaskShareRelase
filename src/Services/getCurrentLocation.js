import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Konum Erişim İzni",
          message: "Bu uygulama konumunuza erişmek istiyor.",
          buttonNeutral: "Daha Sonra Sor",
          buttonNegative: "İptal",
          buttonPositive: "Tamam"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};

const getCurrentLocation = async () => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    return null; // İzin verilmezse null döner
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        resolve(location);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000
      }
    );
  });
};

export default getCurrentLocation;
