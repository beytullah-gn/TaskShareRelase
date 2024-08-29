import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { ref as dbRef, get, set, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker'; // Expo kullanıcıları için
import { db, storage } from '../Services/firebase-config'; // Firebase config dosyanız
import { fetchUserData } from '../Services/fetchUserData';
import fetchActiveDepartments from '../Services/fetchActiveDepartments';
import { deactivateDepartmentAndEmployees } from '../Services/deactivateDepartmentsAndEmployees';
import { styles } from '../styles/addDepartment';
import Icon from "react-native-vector-icons/Feather";
import { useSelector } from 'react-redux';

const AddNewDepartment = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDescription, setDepartmentDescription] = useState('');
  const [departmentsList, setDepartmentsList] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState('');
  const [pdfUri, setPdfUri] = useState(null); // PDF URI durumu

  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userData = await fetchUserData();
        if (userData) {
          setCurrentUser(userData);
        } else {
          Alert.alert('Hata', 'Kullanıcı verileri alınamadı.');
        }
      } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata:', error);
        Alert.alert('Hata', 'Kullanıcı verileri yüklenirken bir hata oluştu.');
      }
    };

    loadCurrentUser();
  }, []);

  const loadDepartments = async () => {
    setIsLoading(true);
    try {
      const activeDepartments = await fetchActiveDepartments();
      if (activeDepartments.length > 0) {
        setDepartmentsList(activeDepartments);
        setIsModalVisible(true);
      } else {
        Alert.alert('Veri Yok', 'Aktif departman bulunamadı.');
      }
    } catch (error) {
      console.error('Departmanlar yüklenirken hata:', error);
      Alert.alert('Hata', 'Departmanlar yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleListDepartments = () => {
    loadDepartments();
  };

  const saveDepartment = async () => {
    if (!departmentName || !departmentDescription || !selectedDepartmentId) {
      Alert.alert('Doğrulama Hatası', 'Lütfen tüm alanları doldurun ve bir departman seçin.');
      return;
    }
    
    const existingDepartmentRef = dbRef(db, 'Departments');
    try {
      const snapshot = await get(existingDepartmentRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const departmentExists = Object.values(data).some(department => {
          const name = department.DepartmentName;
          return typeof name === 'string' && name.toLowerCase() === departmentName.toLowerCase();
        });
        if (departmentExists) {
          Alert.alert('Hata', 'Bu isimde bir departman zaten mevcut.');
          return;
        }
      }
      
      const newDepartmentRef = push(dbRef(db, 'Departments'));
      let pdfUrl = null;
      
      if (pdfUri) {
        try {
          const response = await fetch(pdfUri);
          const blob = await response.blob();
          const pdfRef = storageRef(storage, `pdfs/${newDepartmentRef.key}.pdf`);
          await uploadBytes(pdfRef, blob);
          pdfUrl = await getDownloadURL(pdfRef);
          console.log('PDF başarıyla yüklendi.');
        } catch (uploadError) {
          console.error('PDF yüklenirken hata:', uploadError);
          Alert.alert('Hata', 'PDF yüklenirken bir hata oluştu.');
          return;
        }
      }
      
      await set(newDepartmentRef, {
        DepartmentName: departmentName,
        DepartmentDescription: departmentDescription,
        ParentDepartment: selectedDepartmentId,
        PDFUrl: pdfUrl || "null",
        DepartmentId: newDepartmentRef.key,
        CreatedBy: currentUser?.id,
        Active: true,
        Permissions: {
          Admin: false,
          ManageTasks: false,
          ManagePersons: false,
          ManageDepartments: false
        }
      });
  
      // /DepartmentSubjects altına yeni veri ekle
      const departmentSubjectsRef = dbRef(db, `DepartmentSubjects/${newDepartmentRef.key}`);
      await set(departmentSubjectsRef, {
        DepartmentId: newDepartmentRef.key,
        Title: "Diğer..."
      });
  
      console.log('Departman başarıyla eklendi.');
  
      setSelectedDepartmentId(null);
      setDepartmentName('');
      setDepartmentDescription('');
      setPdfUri(null); // PDF URI'yi sıfırla
      setIsModalVisible(false);
    } catch (error) {
      console.error('Departman eklenirken hata:', error);
      Alert.alert('Hata', 'Departman eklenirken bir hata oluştu.');
    }
  };
  
  const confirmAndDeactivate = async (departmentId, departmentName) => {
    Alert.alert(
      'Onay',
      'Bu departmanı ve altındaki departmanları kaldırmak istediğinize emin misiniz?',
      [
        {
          text: 'Hayır',
          onPress: () => console.log('İptal Edildi'),
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              const departmentRef = dbRef(db, `Departments/${departmentId}`);
              const snapshot = await get(departmentRef);
              if (snapshot.exists()) {
                const department = snapshot.val();
                if (department.Permissions?.Admin) {
                  Alert.alert('Hata', 'Bu departman silinemez.');
                } else {
                  await deactivateDepartmentAndEmployees(departmentId);
                  setDepartmentsList(prevList => prevList.filter(dep => dep.id !== departmentId));
                  setIsModalVisible(false);
                }
              }
            } catch (error) {
              console.error('Departman silinirken hata:', error);
              Alert.alert('Hata', 'Departman silinirken bir hata oluştu.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderDepartmentItem = ({ item }) => (
    <View style={[
      styles.departmentContainer,
      selectedDepartmentId === item.id && styles.selectedItem
    ]}>
      <TouchableOpacity
        style={styles.departmentItem}
        onPress={() => {
          setSelectedDepartmentId(item.id);
          setSelectedDepartmentName(item.DepartmentName);
        }}
      >
        <Text style={styles.departmentText}>Departman Adı: {item.DepartmentName}</Text>
        <Text style={styles.departmentText}>Departman Açıklaması: {item.DepartmentDescription}</Text>
      </TouchableOpacity>
      <View style={styles.deleteContainer}>
        <TouchableOpacity
          style={[styles.deleteButton,]}
          onPress={() => confirmAndDeactivate(item.id, item.DepartmentName)}
        >
          <Icon name="trash-2" size={24} color={selectedTheme.whiteColor} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
  
      // Sonuç detaylarını kontrol et
      console.log('PDF seçim sonucu:', result);
  
      if (result.canceled) {
        Alert.alert('İptal Edildi', 'PDF seçimi iptal edildi.');
        console.log('PDF seçimi iptal edildi.');
      } else if (result.assets && result.assets.length > 0) {
        // PDF seçimi başarılı
        const { uri } = result.assets[0];
        setPdfUri(uri);
        console.log('PDF seçildi:', uri);
      } else {
        Alert.alert('Hata', 'Beklenmeyen bir durum oluştu.');
        console.log('Beklenmeyen durum:', result);
      }
    } catch (error) {
      console.error('PDF seçilirken hata:', error);
      Alert.alert('Hata', 'PDF seçilirken bir hata oluştu.');
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: selectedTheme.whiteColor }]}>
      <View style={[styles.firstcard,{backgroundColor:selectedTheme.fifthColor}]}>
        <Text style={[styles.header, { color: selectedTheme.whiteColor }]}>Yeni Departman Oluştur</Text>
        <View style={[styles.card, { backgroundColor: selectedTheme.thirdColor }]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { borderColor: selectedTheme.secondaryColor }]}
              value={departmentName}
              onChangeText={setDepartmentName}
              placeholder="Departman Adı"
              placeholderTextColor={selectedTheme.secondaryColor}
            />
            <TextInput
              style={[styles.input, { borderColor: selectedTheme.secondaryColor }]}
              value={departmentDescription}
              onChangeText={setDepartmentDescription}
              placeholder="Açıklama"
              placeholderTextColor={selectedTheme.secondaryColor}
            />
          </View>
          <View style={styles.pdfButtonContainer}>
            <TouchableOpacity style={[styles.pdfButton, { backgroundColor: selectedTheme.mainColor }]} onPress={pickPDF}>
              <Text style={[styles.buttonText, { color: selectedTheme.whiteColor }]}>PDF Seç</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: selectedTheme.mainColor }]} onPress={handleListDepartments}>
              <Text style={[styles.buttonText, { color: selectedTheme.whiteColor }]}>Yetkili Seç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: selectedTheme.mainColor }]} onPress={saveDepartment}>
              <Text style={[styles.buttonText, { color: selectedTheme.whiteColor }]}>Departmanı Oluştur</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>  
      {selectedDepartmentName ? (
        <Text style={[styles.selectedDepartmentText, { color: selectedTheme.mainColor }]}>Seçilen departman: {selectedDepartmentName}</Text>
      ) : null}
      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[styles.modalContainer, ]}>
          <View style={[styles.modalContent, { backgroundColor: selectedTheme.whiteColor }]}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: selectedTheme.secondaryColor }]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, { color: selectedTheme.whiteColor }]}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.modalHeader, { color: selectedTheme.mainColor }]}>Departmanlar Listesi</Text>
            {isLoading ? (
              <Text style={[styles.loadingText, { color: selectedTheme.mainColor }]}>Yükleniyor...</Text>
            ) : (
              <FlatList
                data={departmentsList}
                keyExtractor={item => item.id}
                renderItem={renderDepartmentItem}
                contentContainerStyle={styles.listContainer}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddNewDepartment;
