import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from "../Services/firebase-config";
import { ref, set, push } from "firebase/database";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { ref as sref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from "react-native-geocoding";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';



const AddNewPersonScreen = () => {

  Geocoder.init(TRANSLATE_API_KEY);

  const TRANSLATE_API_KEY = Constants.expoConfig.extra.TRANSLATE_API_KEY;


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [accountType, setAccountType] = useState('Employee');
  const [address, setAddress] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tcNumber, setTcNumber] = useState('');
  const [image, setImage] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);
  const handleAddPerson = async () => {
    if (!email || !password || !name || !surname) {
      Alert.alert('Hata', 'E-posta, şifre, ad ve soyad alanları boş bırakılamaz.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin.');
      return;
    }

    try {
      setIsButtonDisabled(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const personRef = push(ref(db, 'Persons'));
      const personId = personRef.key;

      let imageUrl = null;

      if (image) {
        const imageName = `${userId}`;
        const storageRef = sref(storage, `ProfilePictures/${imageName}`);
        const img = await fetch(image);
        const bytes = await img.blob();
        await uploadBytes(storageRef, bytes);
        imageUrl = await getDownloadURL(storageRef);
      }

      await set(ref(db, `Users/${userId}`), {
        EMail: email,
        UserId: userId,
        PersonId: personId,
      });

      await set(personRef, {
        AccountType: accountType,
        Address: address,
        BirthPlace: birthPlace,
        Birthday: birthday,
        Name: name,
        PersonId: personId,
        PhoneNumber: phoneNumber,
        Surname: surname,
        TcNumber: tcNumber,
        ProfilePictureUrl: imageUrl
      });

      // Kullanıcı hesabı oluşturulduktan sonra otomatik oturum açmayı durdurmak için:
      await signOut(auth);

      resetForm();

       Alert.alert('Başarılı', 'Kullanıcı başarıyla eklendi, ancak oturum açılmadı.');
    } catch (error) {
      console.log("Error adding user: ", error);
      handleError(error);
    } finally {
      setTimeout(() => setIsButtonDisabled(false), 5000);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setSurname('');
    setAddress('');
    setBirthPlace('');
    setBirthday('');
    setPhoneNumber('');
    setTcNumber('');
    setImage(null);
    setSelectedLocation(null);
  };

  const handleError = (error) => {
    let errorMessage = 'Kullanıcı eklenirken bir hata oluştu.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Bu e-posta adresi zaten kullanımda.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Şifre çok zayıf.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Geçersiz e-posta adresi.';
    }
    Alert.alert('Hata', errorMessage);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Kameraya erişim izni gerekli!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    console.log(coordinate);
    setSelectedLocation(coordinate);
    setAddress(`Lat: ${coordinate.latitude}, Lon: ${coordinate.longitude}`);
    setRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setMapVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: selectedTheme.fourthColor }]}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: selectedTheme.fourthColor }]}>
        <View style={[styles.outerCard, { backgroundColor: selectedTheme.secondaryColor }]}>
          <Text style={[styles.title,{color:selectedTheme.fifthColor}]}>Yeni Kişi Ekle</Text>
          <Text style={[styles.description,{color:selectedTheme.mainColor}]}>Yeni kişi eklenildiğinde oturumunuz sonlandırılacaktır ve tekrar giriş yapmanız gerekecektir.</Text>
          <View style={[styles.form]}>
            <TextInput
              style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
              value={email}
              onChangeText={setEmail}
              placeholder="E-posta"
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Şifre"
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
              value={name}
              onChangeText={setName}
              placeholder="Ad"
            />
            <TextInput
              style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
              value={surname}
              onChangeText={setSurname}
              placeholder="Soyad"
            />
            <Picker
              selectedValue={accountType}
              style={[styles.picker, { backgroundColor: selectedTheme.fourthColor }]}
              onValueChange={(itemValue) => setAccountType(itemValue)}
            >
              <Picker.Item label="Çalışan" value="Employee" />
              <Picker.Item label="Müşteri" value="Client" />
            </Picker>
            <TextInput
              style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
              value={address}
              placeholder="Adres"
              editable={false}
            />
            <TouchableOpacity style={[styles.button,{backgroundColor:selectedTheme.mainColor}]} onPress={() => setMapVisible(true)}>
              <Text style={{color:selectedTheme.whiteColor}}>Haritadan Adres Seç</Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
              value={birthPlace}
              onChangeText={setBirthPlace}
              placeholder="Doğum Yeri"
            />
            <TextInput
              style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
              value={birthday}
              onChangeText={setBirthday}
              placeholder="Doğum Tarihi"
            />
            <TextInput
              style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Telefon Numarası"
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
              value={tcNumber}
              onChangeText={setTcNumber}
              placeholder="TC Kimlik Numarası"
              keyboardType="number-pad"
            />
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity  onPress={pickImage} style={[styles.button,{backgroundColor:selectedTheme.mainColor}]}>
                <Text style={{color:selectedTheme.whiteColor}}>Fotoğraf Seç</Text>
              </TouchableOpacity>
              {image && (
                <View style={styles.imageContainer}>
                  <Text style={styles.imageLabel}>Seçilen fotoğraf:</Text>
                  <Image source={{ uri: image }} style={styles.image} />
                </View>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Ekle"
                onPress={handleAddPerson}
                color={selectedTheme.fifthColor}
                disabled={isButtonDisabled}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={mapVisible}
        onRequestClose={() => setMapVisible(false)}
        animationType="slide"
      >
        <View style={[styles.modalContainer, { backgroundColor: selectedTheme.secondaryColor }]}>
          <GooglePlacesAutocomplete
            placeholder="Adres Ara"
            onPress={async (data, details = null) => {
              try {
                if (details && details.geometry) {
                  const { lat, lng } = details.geometry.location;
                  const response = await Geocoder.from(lat, lng);
                  const fullAddress = response.results[0].formatted_address;
                  setSelectedLocation({ latitude: lat, longitude: lng });
                  const address = `Lat: ${lat}, Lon: ${lng}`;
                  setAddress(address);
                  console.log(address);
                  setRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  });
                  setMapVisible(false);
                }
              } catch (error) {
                console.log(error);
              }
            }}
            query={{
              key: TRANSLATE_API_KEY,
              language: 'tr',
            }}
            fetchDetails={true}
            styles={{
              textInputContainer: [styles.textInputContainer, { backgroundColor: selectedTheme.fourthColor }],
              textInput: [styles.textInput, { backgroundColor: selectedTheme.fourthColor }],
              listView: styles.listView,  // Arama sonuçları için stil
            }}
          />
          <MapView
            style={[styles.map, { backgroundColor: selectedTheme.mainColor }]}
            region={region}
            onPress={handleMapPress}
          >
            {selectedLocation && (
              <Marker coordinate={selectedLocation} />
            )}
          </MapView>
          <Button title="Kapat" onPress={() => setMapVisible(false)} color={selectedTheme.fifthColor} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  outerCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'justify',
  },
  form: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  imagePickerContainer: {
    marginTop: 20,
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  imageLabel: {
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  textInputContainer: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    borderRadius: 8,
  },
  listView: {
    position: 'absolute',
    top: 50,
    zIndex: 1,
    backgroundColor: 'white',
  },
  button:{
    justifyContent:'center',alignItems:'center',padding:10,marginBottom:10,borderRadius:6,
  }
});

export default AddNewPersonScreen;
