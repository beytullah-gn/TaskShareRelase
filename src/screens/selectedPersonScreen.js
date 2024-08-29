import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, Modal, Touchable, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import { db, storage } from '../Services/firebase-config';
import { update, ref } from 'firebase/database';
import { fetchDepartmentEmployeeData } from '../Services/fetchDepartmentEmployees';
import { fetchDepartmentEmployeeDataByPersonId } from '../Services/fetchDepartmentEmployeesById';
import fetchAllDepartments from '../Services/fetchAllDepartments';
import { ref as sref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from "react-native-geocoding";
import * as SMS from 'expo-sms';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';




const SelectedPerson = ({ route }) => {
    const { person } = route.params;
    const [isEditing, setIsEditing] = useState(false);
    const [personData, setPersonData] = useState({ ...person });
    const [originalData, setOriginalData] = useState({ ...person });
    const [selectedDepartmentEmployee, setSelectedDepartmentEmployee] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [currentDepartmentEmployee, setCurrentDepartmentEmployee] = useState(null);
    const [permissions, setPermissions] = useState({
        Admin: false,
        ManageDepartments: false,
        ManagePersons: false,
        ManageTasks: false,
        Write: false,
    });
    const [image, setImage] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [message, setMessage] = useState('');
    const selectedTheme = useSelector((state) => state.theme.selectedTheme);
    const uri = Constants.expoConfig.extra.uri;
    const TRANSLATE_API_KEY = Constants.expoConfig.extra.TRANSLATE_API_KEY;

    Geocoder.init(TRANSLATE_API_KEY);

    const fetchData = async () => {
        const selectedDepartmentEmployee = await fetchDepartmentEmployeeDataByPersonId(person.PersonId);
        setSelectedDepartmentEmployee(selectedDepartmentEmployee);

        const departments = await fetchAllDepartments();
        const selectedDepartment = departments.find(d => d.id === selectedDepartmentEmployee?.DepartmentId);
        setSelectedDepartment(selectedDepartment);

        const currentDepartmentEmployee = await fetchDepartmentEmployeeData();
        setCurrentDepartmentEmployee(currentDepartmentEmployee);

        if (selectedDepartment && selectedDepartmentEmployee) {
            setPermissions({
                Admin: selectedDepartment.Permissions?.Admin && selectedDepartmentEmployee.Permissions?.Admin,
                ManageDepartments: selectedDepartment.Permissions?.ManageDepartments && selectedDepartmentEmployee.Permissions?.ManageDepartments,
                ManagePersons: selectedDepartment.Permissions?.ManagePersons && selectedDepartmentEmployee.Permissions?.ManagePersons,
                ManageTasks: selectedDepartment.Permissions?.ManageTasks && selectedDepartmentEmployee.Permissions?.ManageTasks,
                Write: selectedDepartmentEmployee.Permissions?.Write,
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, [person]);

    const handleEditToggle = async () => {
        if (isEditing) {
            // Save changes to Firebase
            try {
                let updatedPersonData = { ...personData };

                // Upload new profile picture if selected
                if (image) {
                    const imageName = `${person.PersonId}`;
                    const storageRef = sref(storage, `ProfilePictures/${imageName}`);
                    const img = await fetch(image);
                    const bytes = await img.blob();
                    await uploadBytes(storageRef, bytes);
                    const imageUrl = await getDownloadURL(storageRef);
                    updatedPersonData.ProfilePictureUrl = imageUrl;
                }

                await update(ref(db, 'Persons/' + person.PersonId), updatedPersonData);
                Alert.alert("Başarılı", "Veriler başarıyla güncellendi.");
                setOriginalData({ ...updatedPersonData });
                setImage(null); // Clear selected image after upload
            } catch (error) {
                Alert.alert("Hata", "Veriler güncellenirken bir hata oluştu: " + error.message);
            }
        }
        setIsEditing(!isEditing);
    };

    const handleSendSMS = async () => {
        const { result } = await SMS.sendSMSAsync(
          [personData.PhoneNumber],
          `${message}`
        );
        if (result === 'sent') {
          console.log('SMS sent successfully!');
        } else {
          console.log('Failed to send SMS.');
        }
      };

    const handleCancelEdit = () => {
        setPersonData({ ...originalData });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setPersonData({ ...personData, [field]: value });
    };

    const handlePermissionChange = (permission) => {
        setPermissions({ ...permissions, [permission]: !permissions[permission] });
    };

    const handleSavePermissions = async () => {
        if (selectedDepartmentEmployee) {
            try {
                await update(ref(db, `DepartmentEmployees/${selectedDepartmentEmployee.id}/Permissions`), {
                    ...permissions
                });
                Alert.alert("Başarılı", "İzinler başarıyla güncellendi.");
            } catch (error) {
                Alert.alert("Hata", "İzinler güncellenirken bir hata oluştu: " + error.message);
            }
        }
    };

    const handleMapPress = (e) => {
        const { coordinate } = e.nativeEvent;
        setSelectedLocation(coordinate);
        handleInputChange("Address", `Lat: ${coordinate.latitude}, Lon: ${coordinate.longitude}`);
        setRegion({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Kamera veya galeriye erişim izni gerekli!");
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

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: selectedTheme.thirdColor }]} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: selectedTheme.whiteColor, borderColor: selectedTheme.mainColor }]}>
          {/* Display the profile picture */}
          <View style={styles.profilePictureContainer}>
            {personData && personData.ProfilePictureUrl ? (
              <Image
                source={{ uri: personData.ProfilePictureUrl }}
                style={[styles.profilePicture, { borderColor: selectedTheme.mainColor }]}
              />
            ) : (
              <Image
                source={{ uri: uri }}
                style={[styles.profilePicture, { borderColor: selectedTheme.mainColor }]}
              />
            )}
          </View>
          {isEditing && (
            <View style={styles.imagePickerContainer}>
              <Button title="Fotoğraf Seç" onPress={pickImage} color={selectedTheme.mainColor} />
              {image && (
                <View style={styles.imageContainer}>
                  <Text style={[styles.imageLabel, { color: selectedTheme.mainColor }]}>Seçilen fotoğraf:</Text>
                  <Image source={{ uri: image }} style={styles.image} />
                </View>
              )}
            </View>
          )}
          {isEditing ? (
            <View>
              <TextInput
                style={[styles.input, { borderColor: selectedTheme.secondaryColor }]}
                value={personData.Name}
                onChangeText={(text) => handleInputChange('Name', text)}
                placeholder="Name"
              />
              <TextInput
                style={[styles.input, { borderColor: selectedTheme.secondaryColor }]}
                value={personData.Surname}
                onChangeText={(text) => handleInputChange('Surname', text)}
                placeholder="Surname"
              />
              <Picker
                selectedValue={personData.AccountType}
                style={[styles.picker, { borderColor: selectedTheme.secondaryColor }]}
                onValueChange={(itemValue) => handleInputChange('AccountType', itemValue)}
              >
                <Picker.Item label="Çalışan" value="Employee" />
                <Picker.Item label="Müşteri" value="Client" />
              </Picker>
              <Button title="Haritadan Adres Seç" onPress={() => setMapVisible(true)} color={selectedTheme.mainColor} />
              <TextInput
                style={[styles.input, { borderColor: selectedTheme.secondaryColor }]}
                value={personData.BirthPlace}
                onChangeText={(text) => handleInputChange('BirthPlace', text)}
                placeholder="Birth Place"
              />
              <TextInput
                style={[styles.input, { borderColor: selectedTheme.secondaryColor }]}
                value={personData.Birthday}
                onChangeText={(text) => handleInputChange('Birthday', text)}
                placeholder="Birthday"
              />
              <TextInput
                style={[styles.input, { borderColor: selectedTheme.secondaryColor }]}
                value={personData.PhoneNumber}
                onChangeText={(text) => handleInputChange('PhoneNumber', text)}
                placeholder="Phone Number"
              />
              <TextInput
                style={[styles.input, { borderColor: selectedTheme.secondaryColor }]}
                value={personData.TcNumber}
                onChangeText={(text) => handleInputChange('TcNumber', text)}
                placeholder="Tc Number"
              />
            </View>
          ) : (
            <View>
              <Text style={[styles.title, { color: selectedTheme.fifthColor }]}>{personData.Name} {personData.Surname}</Text>
              <Text style={[styles.detail, { color: selectedTheme.fifthColor }]}>Hesap Türü: {personData.AccountType === 'Employee' ? 'Çalışan' : 'Müşteri'}</Text>
              <Text style={[styles.detail, { color: selectedTheme.fifthColor }]}>Doğum Yeri: {personData.BirthPlace}</Text>
              <Text style={[styles.detail, { color: selectedTheme.fifthColor }]}>Doğum Günü: {personData.Birthday}</Text>
              <Text style={[styles.detail, { color: selectedTheme.fifthColor }]}>Telefon Numarası: {personData.PhoneNumber}</Text>
              <Text style={[styles.detail, { color: selectedTheme.fifthColor }]}>Tc Numarası: {personData.TcNumber}</Text>
            </View>
          )}
          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <View style={[styles.button, { backgroundColor: selectedTheme.mainColor }]}>
                  <Button title="Kaydet" onPress={handleEditToggle} color={selectedTheme.mainColor} />
                </View>
                <View style={[styles.button, { backgroundColor: '#d11141' }]}>
                  <Button title="İptal Et" onPress={handleCancelEdit} color={selectedTheme.mainColor} />
                </View>
              </>
            ) : (
              <View style={[styles.button, { backgroundColor: selectedTheme.mainColor }]}>
                <Button title="Düzenle" onPress={handleEditToggle} color={selectedTheme.mainColor} />
              </View>
            )}
          </View>
        </View>
        {selectedDepartmentEmployee && currentDepartmentEmployee?.Permissions?.Admin && selectedDepartmentEmployee.EmployeeId !== currentDepartmentEmployee.EmployeeId && (
          <View style={[styles.card, { backgroundColor: selectedTheme.whiteColor, borderColor: selectedTheme.mainColor }]}>
            <Text style={[styles.title, { color: selectedTheme.mainColor }]}>İzinleri Düzenle</Text>
            {selectedDepartment?.Permissions?.Admin && (
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={permissions.Admin}
                  onValueChange={() => handlePermissionChange('Admin')}
                />
                <Text style={[styles.checkboxLabel, { color: selectedTheme.mainColor }]}>Admin</Text>
              </View>
            )}
            {selectedDepartment?.Permissions?.ManageDepartments && (
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={permissions.ManageDepartments}
                  onValueChange={() => handlePermissionChange('ManageDepartments')}
                />
                <Text style={[styles.checkboxLabel, { color: selectedTheme.mainColor }]}>Departmanları Yönet</Text>
              </View>
            )}
            {selectedDepartment?.Permissions?.ManagePersons && (
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={permissions.ManagePersons}
                  onValueChange={() => handlePermissionChange('ManagePersons')}
                />
                <Text style={[styles.checkboxLabel, { color: selectedTheme.mainColor }]}>Kişileri Yönet</Text>
              </View>
            )}
            {selectedDepartment?.Permissions?.ManageTasks && (
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={permissions.ManageTasks}
                  onValueChange={() => handlePermissionChange('ManageTasks')}
                />
                <Text style={[styles.checkboxLabel, { color: selectedTheme.mainColor }]}>Görevleri Yönet</Text>
              </View>
            )}
            {selectedDepartment?.Permissions && (
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={permissions.Write}
                  onValueChange={() => handlePermissionChange('Write')}
                />
                <Text style={[styles.checkboxLabel, { color: selectedTheme.mainColor }]}>Talepleri Yönet</Text>
              </View>
            )}
            <View style={[styles.button, { backgroundColor: selectedTheme.mainColor }]}>
              <Button title="İzinleri Kaydet" onPress={handleSavePermissions} color={selectedTheme.mainColor} />
            </View>
          </View>
        )}
        <View style={[styles.card, { backgroundColor: selectedTheme.whiteColor, borderColor: selectedTheme.mainColor }]}>
          <Text style={[styles.title, { color: selectedTheme.mainColor }]}>Mesaj Gönder</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput style={[styles.sendInput, { borderColor: selectedTheme.secondaryColor }]} value={message} onChangeText={setMessage} />
            <View style={[styles.sendButton, { backgroundColor: selectedTheme.mainColor }]}>
              <TouchableOpacity onPress={handleSendSMS}>
                <Icon name={"send"} size={20} color={selectedTheme.whiteColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Modal
          visible={mapVisible}
          onRequestClose={() => setMapVisible(false)}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.autocompleteContainer}>
              <GooglePlacesAutocomplete
                placeholder="Adres Ara"
                autoFocus={true}
                onPress={async (data, details = null) => {
                  try {
                    if (details && details.geometry) {
                      const { lat, lng } = details.geometry.location;
                      const response = await Geocoder.from(lat, lng);
                      const fullAddress = response.results[0].formatted_address;
                      console.log({ latitude: lat, longitude: lng });
                      setSelectedLocation({ latitude: lat, longitude: lng });
                      const address = `Lat: ${lat}, Lon: ${lng}`;
                      console.log("=====================>", address);
                      handleInputChange("Address", address);
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
                  textInputContainer: styles.textInputContainer,
                  textInput: [styles.textInput, { borderColor: selectedTheme.secondaryColor }],
                  listView: {
                    ...styles.listView,
                    position: 'absolute',
                    top: 50,
                    zIndex: 10, // Yüksek bir z-index vererek arama sonuçlarının görünür kalmasını sağlayın
                  },
                }}
                onBlur={() => { }} // onBlur olayını boş bir fonksiyonla geçersiz kılın
              />
            </View>
            <MapView
              style={styles.map}
              region={region}
              onPress={handleMapPress}
            >
              {selectedLocation && (
                <Marker coordinate={selectedLocation} />
              )}
            </MapView>
            <Button title="Kapat" onPress={() => setMapVisible(false)} color={selectedTheme.mainColor} />
          </View>
        </Modal>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
    },
    card: {
      padding: 20,
      marginVertical: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
      borderWidth: 1,
    },
    profilePictureContainer: {
      alignItems: 'center',
      marginBottom: 15,
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
    },
    imagePickerContainer: {
      alignItems: 'center',
      marginBottom: 15,
    },
    imageContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    imageLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    detail: {
      fontSize: 16,
      marginVertical: 5,
    },
    input: {
      height: 40,
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
    },
    sendInput: {
      flex: 7,
      height: 55,
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: '#fff',
    },
    picker: {
      height: 40,
      borderWidth: 1,
      marginBottom: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
    },
    buttonContainer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
    },
    sendButton: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
      height: 55,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    checkboxLabel: {
      marginLeft: 10,
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'white',
      padding: 16,
      justifyContent: 'flex-start',
    },
    autocompleteContainer: {
      flex: 1,
      marginBottom: 10,
    },
    map: {
      width: '100%',
      height: '70%',
    },
    textInputContainer: {
      width: '100%',
      backgroundColor: '#fff',
    },
    textInput: {
      height: 40,
      borderWidth: 1,
      paddingHorizontal: 10,
    },
    listView: {
      backgroundColor: '#fff',
      position: 'absolute',
      top: 50,
      zIndex: 1,
    },
  });
  
  export default SelectedPerson;