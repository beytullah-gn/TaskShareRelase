import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Alert, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SignOutService } from '../Auth/SignOut';
import BottomBar from '../Components/BottomBar';
import defaultPalette from '../../assets/Palettes/defaultPalette';
import secondPalette from '../../assets/Palettes/secondPalette';
import thirdPalette from '../../assets/Palettes/thirdPalette';
import fourthPalette from '../../assets/Palettes/fourthPalette';
import fifthPalette from '../../assets/Palettes/fifthPalette';
import sixthPalette from '../../assets/Palettes/sixthPalette';
import seventhPalette from '../../assets/Palettes/seventhPalette';
import SignOutButton from '../Components/SettingsScreen/SignOutButton';
import LocationButton from '../Components/SettingsScreen/LocationButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchPersonData } from '../Services/fetchPersonData';
import { setTheme, loadTheme } from '../Redux/themeSlice';
import LanguageModal from '../Components/SettingsScreen/languageModal';
import Constants from 'expo-constants';
import LocationModal from '../Components/SettingsScreen/LocationModal';
import InfoModal from '../Components/SettingsScreen/infoModal';

const SettingsScreen = ({ navigation }) => {
  const [languageModal, setLanguageModal] = useState(false);
  const [themeExpanded, setThemeExpanded] = useState(false);
  const [person, setPerson] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [defaultRegion, setDefaultRegion] = useState({
    latitude: 41.015137,
    longitude: 28.979530,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location.location);
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);
  const systemLanguage = useSelector((state) => state.language);
  const uri = Constants.expoConfig.extra.uri;

  useEffect(() => {
    const getDd = async () => {
      const personData = await fetchPersonData();
      setPerson(personData);
    };

    getDd();
  }, []);

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  const handleShowLocation = () => {
    if (location) {
      setLocationModalVisible(true);
    } else {
      Alert.alert('Konum Bilgisi', 'Konum bilgisi mevcut değil.');
    }
  };

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const handleThemeChange = async (theme) => {
    dispatch(setTheme(theme));
    try {
      await AsyncStorage.setItem('selectedTheme', theme);
    } catch (error) {
      console.error('Tema AsyncStorage\'a kaydedilirken bir hata oluştu:', error);
    }
    setThemeExpanded(false);
  };


  const palettes = {
    default: defaultPalette,
    second: secondPalette,
    third: thirdPalette,
    fourth: fourthPalette,
    fifth: fifthPalette,
    sixth: sixthPalette,
    seventh: seventhPalette
  };

  const themes = Object.keys(palettes);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: selectedTheme.fifthColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <View style={[styles.card, { borderColor: selectedTheme.whiteColor }]}>
            <LocationButton
              onPress={handleShowLocation}
              color={selectedTheme}
              style={styles.locationButton}
            />
            <View style={styles.profileContainer}>
              {person && person.ProfilePictureUrl ? (
                <Image
                  source={{ uri: person.ProfilePictureUrl }}
                  style={[styles.profileImage, { borderColor: selectedTheme.whiteColor }]}
                />
              ) : (
                <Image
                  source={{ uri: uri }}
                  style={[styles.profileImage, { borderColor: selectedTheme.whiteColor }]}
                />
              )}
              {person ? (
                <>
                  <Text style={[styles.profileName, { color: selectedTheme.whiteColor }]}>
                    {person.Name} {person.Surname}
                  </Text>
                  <View style={[styles.separator, { backgroundColor: selectedTheme.whiteColor }]} />
                </>
              ) : (
                <Text style={[styles.profileName, { color: selectedTheme.whiteColor }]}>
                  Bilgiler yükleniyor...
                </Text>
              )}

              <View style={[styles.themeContainer, { borderColor: selectedTheme.whiteColor }]}>
                <TouchableOpacity
                  style={[styles.themeButton]}
                  onPress={() => setThemeExpanded(!themeExpanded)}
                >
                  <Text style={[styles.themeButtonText, { color: selectedTheme.whiteColor }]}>Tema Seç</Text>
                </TouchableOpacity>

                {themeExpanded && (
                  <View style={styles.themeOptions}>
                    {themes.map((theme) => (
                      <TouchableOpacity
                        key={theme}
                        style={[
                          styles.themeOption,
                          { backgroundColor: palettes[theme].mainColor },
                          selectedTheme.name === theme && styles.selectedThemeOption
                        ]}
                        onPress={() => handleThemeChange(theme)}
                      />
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[styles.languageButton, { borderColor: selectedTheme.whiteColor }]}
                onPress={() => setLanguageModal(true)}
              >
                <Text style={[styles.buttonText, { color: selectedTheme.whiteColor }]}>Dil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.aboutButton, { borderColor: selectedTheme.whiteColor }]}
                onPress={() => setInfoModal(true)}
              >
                <Text style={[styles.buttonText, { color: selectedTheme.whiteColor }]}>Hakkında</Text>
              </TouchableOpacity>
            </View>

            <SignOutButton
              onPress={SignOutService}
              backgroundColor={selectedTheme}
              style={styles.signOutButton}
            />
          </View>
        </View>
      </ScrollView>
      <LanguageModal
        visible={languageModal}
        onClose={() => setLanguageModal(false)}
        systemLanguage={systemLanguage}
        selectedTheme={selectedTheme}
      />
      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        location={location}
        selectedTheme={selectedTheme}
        defaultRegion={defaultRegion}
      />
      <InfoModal
        visible={infoModal}
        onClose={() => setInfoModal(false)}
        selectedTheme={selectedTheme}
      />
      <BottomBar
        onProfile={() => handleNavigation('MyProfile')}
        onDepartments={() => handleNavigation('Departments')}
        onPersons={() => handleNavigation('Persons')}
        onQrScreen={() => handleNavigation('QrScreen')}
        onMessages={() => handleNavigation('Messages')}
        onMapScreen={() => handleNavigation('MapScreen')}
        onNfc={() => handleNavigation('NfcScreen')}
        activePage='settings'
        style={styles.bottomBar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 50, // SignOutButton için boşluk bırakmak için padding ekliyoruz
  },
  cardContainer: {
    width: '100%',
    padding: 10,
  },
  card: {
    width: '100%',
    borderWidth: 3,
    borderRadius: 5,
    borderTopRightRadius: 35,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  locationButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    width: '100%',
    height: 1,
    marginVertical: 20,
  },
  themeContainer: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
  themeButton: {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  themeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  themeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center',
  },
  themeOption: {
    width: 40,
    height: 40,
    borderRadius: 5,
    margin: 5,
  },
  selectedThemeOption: {
    borderWidth: 2,
    borderColor: 'white',
  },
  languageButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  aboutButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  signOutButton: {
    marginTop: 20,
    marginBottom: 30, // BottomBar ile arasında boşluk bırakmak için alt marjin ekleyelim
  },
});

export default SettingsScreen;
