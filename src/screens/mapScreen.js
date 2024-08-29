import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import BottomBar from '../Components/BottomBar';
import fetchAllPersons from '../Services/fetchAllPersons';
import MapView, { Marker, Polyline } from 'react-native-maps';

const MapScreen = ({ navigation }) => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: 41.015137,
    longitude: 28.979530,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  const getPersonData = useCallback(async () => {
    try {
      setLoading(true);
      const personsData = await fetchAllPersons();
      setPersons(personsData);

      if (personsData.length > 0) {
        const firstPersonAddress = personsData[0]?.Address;
        if (firstPersonAddress && firstPersonAddress.includes('Lat:') && firstPersonAddress.includes('Lon:')) {
          const [lat, lon] = firstPersonAddress.split(', ');
          const latitude = parseFloat(lat.replace('Lat: ', ''));
          const longitude = parseFloat(lon.replace('Lon: ', ''));

          if (!isNaN(latitude) && !isNaN(longitude)) {
            setMapRegion({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            });
          }
        }
      }
    } catch (error) {
      console.log('Error fetching persons:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getPersonData();
    }, [getPersonData])
  );

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={[styles.topView, { backgroundColor: selectedTheme.fourthColor }]}>
      <View style={[styles.header, { backgroundColor: selectedTheme.mainColor }]}>
        {loading ? (
          <Text style={[styles.headerText, { color: selectedTheme.whiteColor }]}>Yükleniyor...</Text>
        ) : (
          <Text style={[styles.headerText, { color: selectedTheme.whiteColor }]}>Kullanıcıların Konumları</Text>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={selectedTheme.mainColor} />
        ) : (
          <>
            <Text style={[styles.description, { color: selectedTheme.secondaryColor }]}>
              Haritada kullanıcıların konumları gösterilmektedir.Kullanıcılar arasında bağlantılar da çizilmiştir.
            </Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={mapRegion}
              >
                {persons.map((person, index) => {
                  const address = person.Address;
                  if (address && address.includes('Lat:') && address.includes('Lon:')) {
                    const [lat, lon] = address.split(', ');
                    const latitude = parseFloat(lat.replace('Lat: ', ''));
                    const longitude = parseFloat(lon.replace('Lon: ', ''));

                    if (!isNaN(latitude) && !isNaN(longitude)) {
                      return (
                        <Marker
                          key={index}
                          coordinate={{ latitude, longitude }}
                          title={`${person.Name} ${person.Surname}`}
                          description={` ${person.Name} ${person.Surname} adlı kişinin konumu`}
                          pinColor={selectedTheme.mainColor}
                        />
                      );
                    }
                  }
                  return null;
                })}

                {/* Kullanıcılar arasında çizgiler çizmek */}
                {persons.length > 1 && (
                  <Polyline
                    coordinates={persons.map((person) => {
                      const address = person.Address;
                      if (address && address.includes('Lat:') && address.includes('Lon:')) {
                        const [lat, lon] = address.split(', ');
                        const latitude = parseFloat(lat.replace('Lat: ', ''));
                        const longitude = parseFloat(lon.replace('Lon: ', ''));
                        return { latitude, longitude };
                      }
                      return null;
                    }).filter(Boolean)}
                    strokeColor={selectedTheme.fifthColor} // Çizgi rengi
                    strokeWidth={2} // Çizgi kalınlığı
                  />
                )}
              </MapView>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomBarContainer}>
        <BottomBar
          onProfile={() => handleNavigation('MyProfile')}
          onDepartments={() => handleNavigation('Departments')}
          onSettings={() => handleNavigation('Settings')}
          onQrScreen={() => handleNavigation('QrScreen')}
          onMessages={() => handleNavigation('Messages')}
          onPersons={() => handleNavigation('Persons')}
          onNfc={() => handleNavigation('NfcScreen')}
          activePage="map"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topView: {
    flex: 1,
  },
  header: {
    paddingTop: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  mapContainer: {
    width: '90%',
    height: 500,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  map: {
    flex: 1,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default MapScreen;
