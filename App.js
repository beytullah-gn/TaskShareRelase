import React, { useEffect, useState } from 'react';
import Navigation from './src/Components/Navigation';
import * as RNLocalize from 'react-native-localize';
import { setLanguage } from './src/Redux/languageSlice';
import { setIp, setLocation } from './src/Redux/locationSlice';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/Redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTheme, loadTheme, saveTheme } from './src/Redux/themeSlice'
import Constants from 'expo-constants';


const AppContent = () => {
  const dispatch = useDispatch();
  const [ip, setIpState] = useState(null);
  const [location, setLocationState] = useState(null);
  const ip_geo_api = Constants.expoConfig.extra.ip_geo_api

  useEffect(() => {
    // IP adresini al
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        const ipAddress = data.ip;
        setIpState(ipAddress);
        dispatch(setIp(ipAddress));
        // IP adresinden konum bilgisi al
        return fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${ip_geo_api}ip=${ipAddress}`);
      })
      .then(response => response.json())
      .then(data => {
        setLocationState(data);
        dispatch(setLocation(data));
      })
      .catch(error => console.error('Error fetching IP or location:', error));
  }, [dispatch]);

  useEffect(() => {
    const locales = RNLocalize.getLocales();
    const systemLanguage = locales[0].languageTag;
    dispatch(setLanguage(systemLanguage));
  }, [dispatch]);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('selectedTheme');
        if (storedTheme) {
          store.dispatch(setTheme(storedTheme)); // Redux store'a temayı kaydet
        }
      } catch (error) {
        console.error('Tema AsyncStorage\'dan alınırken bir hata oluştu:', error);
      }
    };

    fetchTheme(); // Tema bilgilerini almak için fonksiyonu çağır
  }, []);

  return (
    <Navigation />
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
