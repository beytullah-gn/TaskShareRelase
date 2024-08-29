import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useCodeScanner } from 'react-native-vision-camera';
import fetchPersonById from '../Services/fetchPersonById';
import BottomBar from '../Components/BottomBar';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const QRCodeScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const devices = useCameraDevices();
  const device = devices[0];
  const cameraRef = useRef(null);

  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  useEffect(() => {
    const getCameraPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    };

    getCameraPermission();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsCameraVisible(false);
    }, [])
  );

  const handleDepartments = () => navigation.navigate('Departments');
  const handleProfile = () => navigation.navigate('MyProfile');
  const handleSettings = () => navigation.navigate('Settings');
  const handlePersons = () => navigation.navigate("Persons");
  const handleOnMessages = () => navigation.navigate('Messages');
  const handleOnMapScreen = () => navigation.navigate('MapScreen');
  const handleOnNfc = () => navigation.navigate("NfcScreen");

  const handleButtonPress = () => setIsCameraVisible(true);
  const handleCloseCamera = () => setIsCameraVisible(false);

  const handleScan = async (data) => {
    try {
      const person = await fetchPersonById(data);
      navigation.navigate("SelectedPerson", { person });
    } catch (error) {
      console.error("Error fetching person:", error);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const data = codes[0].value;
        setIsCameraVisible(false);
        Alert.alert('Tarama Sonucu', data, [
          {
            text: 'Tamam',
            onPress: () => handleScan(data),
          },
        ]);
      }
    },
  });

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: selectedTheme.thirdColor }]}>
        <Text style={{ color: selectedTheme.mainColor }}>Kamera izni gereklidir.</Text>
        <BottomBar
          onProfile={handleProfile}
          onDepartments={handleDepartments}
          onPersons={handlePersons}
          onSettings={handleSettings}
          onMessages={handleOnMessages}
          onMapScreen={handleOnMapScreen}
          onNfc={handleOnNfc}
          activePage="qr"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: selectedTheme.thirdColor }]}>
      {!isCameraVisible ? (
        <>
          <TouchableOpacity 
            style={[styles.openButton, { backgroundColor: selectedTheme.mainColor }]} 
            onPress={handleButtonPress}
          >
            <Text style={[styles.openButtonText, { color: selectedTheme.whiteColor }]}>Kamerayı Aç</Text>
          </TouchableOpacity>
          <Text style={[styles.descriptionText, { color: selectedTheme.mainColor }]}>QR kodu okutmak için kamerayı açın</Text>
        </>
      ) : (
        <>
          <View style={[styles.cameraContainer, { borderColor: selectedTheme.fourthColor }]}>
            {device && (
              <Camera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={isCameraVisible}
                codeScanner={codeScanner}
                onInitialized={() => console.log('Kamera başlatıldı')}
                onError={(error) => console.error('Kamera hatası:', error)}
              />
            )}
          </View>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: selectedTheme.mainColor }]} 
            onPress={handleCloseCamera}
          >
            <Text style={[styles.closeButtonText, { color: selectedTheme.whiteColor }]}>Kamerayı Kapat</Text>
          </TouchableOpacity>
        </>
      )}
      <BottomBar
        onProfile={handleProfile}
        onDepartments={handleDepartments}
        onPersons={handlePersons}
        onSettings={handleSettings}
        onMessages={handleOnMessages}
        onMapScreen={handleOnMapScreen}
        onNfc={handleOnNfc}
        activePage="qr"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    padding: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  openButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  cameraContainer: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRCodeScannerScreen;
