import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions, SafeAreaView, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BottomBar from '../Components/BottomBar';
import { fetchDepartmentEmployeeData } from '../Services/fetchDepartmentEmployees';
import { fetchCurrentDepartment } from '../Services/fetchCurrentUserDepartment';
import { fetchPersonData } from '../Services/fetchPersonData';
import { fetchInactiveDepartments } from '../Services/fetchInactiveDepartments';
import fetchAllDepartments from '../Services/fetchAllDepartments';
import fetchDepartments from '../Services/fetchActiveDepartments';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';


const formatDateString = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', options);
};


// Function to get color based on index
const getColorForIndex = (index, color1, color2) => {
  return index % 2 === 0 ? color1 : color2;
};

const renderDepartments = (departments, parentId, index = 0, color1, color2) => {
  return (
    <View>
      {departments
        .filter(dept => dept.ParentDepartment === parentId)
        .map((dept, deptIndex) => (
          <View key={dept.DepartmentId} style={{ marginBottom: 5 }}>
            <View style={[styles.responsibleDepartmentItem, { backgroundColor: getColorForIndex(index + deptIndex, color1, color2) }]}>
              <Text><Text style={styles.boldText}>Departman Adı: </Text>{dept.DepartmentName}</Text>
              <Text><Text style={styles.boldText}>Departman Açıklaması: </Text>{dept.DepartmentDescription}</Text>
            </View>
            {renderDepartments(departments, dept.DepartmentId, index + deptIndex + 1, color1, color2)}
          </View>
        ))}
    </View>
  );
};

const MyProfile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userDepartment, setUserDepartment] = useState(null);
  const [userCurrentDepartment, setUserCurrentDepartment] = useState(null);
  const [userOldDepartment, setUserOldDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allDepartments, setAllDepartments] = useState(null);
  const [activeDepartments, setActiveDepartments] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }); // Yeni eklenen state
  const uri = Constants.expoConfig.extra.uri;

  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  const getUserData = useCallback(async () => {
    try {
      setLoading(true);
      const [employeeData, departmentData, currentDepartmentData, oldDepartmentData, allDepartmentsData, activeDepartments] = await Promise.all([
        fetchPersonData(),
        fetchDepartmentEmployeeData(),
        fetchCurrentDepartment(),
        fetchInactiveDepartments(),
        fetchAllDepartments(),
        fetchDepartments(),
      ]);
      setUserInfo(employeeData);
      setUserDepartment(departmentData);
      setUserCurrentDepartment(currentDepartmentData);
      setUserOldDepartment(oldDepartmentData);
      setAllDepartments(allDepartmentsData);
      setActiveDepartments(activeDepartments);

      // Harita konumunu ayarla
      if (employeeData?.Address) {
        const [lat, lon] = employeeData.Address.split(', ');
        setMapRegion({
          latitude: parseFloat(lat.replace('Lat: ', '')),
          longitude: parseFloat(lon.replace('Lon: ', '')),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [getUserData])
  );

  const handleDepartments = () => {
    navigation.navigate('Departments');
  };

  const handlePersons = () => {
    navigation.navigate('Persons');
  };

  const handleQrScreen = () => {
    navigation.navigate('QrScreen');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleOnMessages = () => {
    navigation.navigate('Messages');
  };

  const handleOnMapScreen = () => {
    navigation.navigate('MapScreen');
  };

  const handleOnNfc = () => {
    navigation.navigate("NfcScreen")
  }

  const handleViewPDF = () => {
    if (userCurrentDepartment && userCurrentDepartment.PDFUrl) {
      navigation.navigate("MyDocument", { pdfUrl: userCurrentDepartment.PDFUrl });
    } else {
      alert('PDF dosyası bulunamadı.');
    }
  };


  return (
    <SafeAreaView style={[styles.topView, { backgroundColor: selectedTheme.thirdColor }]}>
      <View style={[styles.header, { backgroundColor: selectedTheme.mainColor }]}>
        {loading ? (
          <Text style={styles.headerText}>Yükleniyor...</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.line} />
            <Text style={[styles.headerText, { color: selectedTheme.thirdColor,opacity:0.8}]}>Profilim</Text>
            <View style={styles.line} />
          </View>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {!loading && (
          <>
            {userInfo && userInfo.ProfilePictureUrl ? (
              <View style={[styles.profilePhoto, { backgroundColor: selectedTheme.mainColor, flexDirection: 'row', alignItems: 'flex-end' }]}>
                  <View style={[styles.profilePictureContainer2, { borderColor: selectedTheme.thirdColor, backgroundColor: selectedTheme.thirdColor }]}>
                    <View style={[styles.profilePictureContainer, { borderColor: selectedTheme.mainColor }]}>
                      <Image
                        source={{ uri: userInfo.ProfilePictureUrl }}
                        style={styles.profilePicture}
                      />
                  </View>
                </View>
                <View>
                  <Text style={[styles.headerText, { color: selectedTheme.whiteColor, paddingLeft: 30, paddingBottom: 5}]}>{userInfo.Name} {userInfo.Surname}</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.profilePhoto, { backgroundColor: selectedTheme.mainColor, flexDirection: 'row', alignItems: 'flex-end' }]}>
                <View style={[styles.profilePictureContainer2, { borderColor: selectedTheme.thirdColor, backgroundColor: selectedTheme.thirdColor }]}>
                  <View style={[styles.profilePictureContainer, { borderColor: selectedTheme.mainColor }]}>
                    <Image
                      source={{ uri: uri }}
                      style={[styles.profilePicture]}
                    />
                  </View>
                </View>
                <View>
                  <Text style={[styles.headerText, { color: selectedTheme.whiteColor, paddingLeft: 30, paddingBottom: 5 }]}>{userInfo.Name} {userInfo.Surname}</Text>
                </View>
              </View>

            )}

            {userInfo ? (
              <View style={[styles.card, { backgroundColor: selectedTheme.fourthColor, borderColor: selectedTheme.mainColor }]}>
                <Text style={[styles.cardTitle, { color: selectedTheme.mainColor }]}>Bilgilerim</Text>
                <Text><Text style={styles.boldText}>Adı: </Text>{userInfo.Name}</Text>
                <Text><Text style={styles.boldText}>Soyadı: </Text>{userInfo.Surname}</Text>
                <Text><Text style={styles.boldText}>TC: </Text>{userInfo.TcNumber}</Text>
                <Text><Text style={styles.boldText}>Telefon Numarası: </Text>{userInfo.PhoneNumber}</Text>
                <Text><Text style={styles.boldText}>Doğum Günü: </Text>{userInfo.Birthday}</Text>
                <Text><Text style={styles.boldText}>Doğum Yeri: </Text>{userInfo.BirthPlace}</Text>
              </View>
            ) : (
              <Text>Kişi bulunamadı.</Text>
            )}
            {userDepartment && userCurrentDepartment ? (
              <View style={[styles.card, { backgroundColor: selectedTheme.fourthColor, borderColor: selectedTheme.mainColor }]}>
                <Text style={[styles.cardTitle, { color: selectedTheme.mainColor }]}>Mevcut Departman Bilgilerim</Text>
                <Text><Text style={styles.boldText}>Departman Adı: </Text>{userCurrentDepartment.DepartmentName}</Text>
                <Text><Text style={styles.boldText}>Departman Açıklaması: </Text>{userCurrentDepartment.DepartmentDescription}</Text>
                <Text><Text style={styles.boldText}>Başlama Tarihi: </Text>{formatDateString(userDepartment.StartingDate)}</Text>
                <TouchableOpacity style={[styles.pdfButton, { backgroundColor: selectedTheme.mainColor }]} onPress={handleViewPDF}>
                  <Text style={styles.pdfButtonText}>Departman PDF'ini Görüntüle</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {userOldDepartment && userOldDepartment.length > 0 ? (
              <View style={[styles.card, { backgroundColor: selectedTheme.fourthColor, borderColor: selectedTheme.mainColor }]}>
                <Text style={[styles.cardTitle, { color: selectedTheme.mainColor }]}>Çalışma Geçmişim</Text>
                {userOldDepartment.map((dept, index) => {
                  const department = allDepartments.find(d => d.DepartmentId === dept.DepartmentId);
                  return (
                    <View
                      key={index}
                      style={[
                        styles.oldDepartmentItem,
                        { backgroundColor: getColorForIndex(index, selectedTheme.fourthColor, selectedTheme.whiteColor) }
                      ]}
                    >
                      <Text><Text style={styles.boldText}>Departman Adı: </Text>{department ? department.DepartmentName : 'Bilinmiyor'}</Text>
                      <Text><Text style={styles.boldText}>Başlama Tarihi: </Text>{formatDateString(dept.StartingDate)}</Text>
                      <Text><Text style={styles.boldText}>Bitiş Tarihi: </Text>{formatDateString(dept.EndDate)}</Text>
                    </View>
                  );
                })}
              </View>
            ) : null}
            {/* Harita gösterimi */}
            {mapRegion && (
              <View style={[styles.mapCard, { backgroundColor: selectedTheme.fourthColor, borderColor: selectedTheme.mainColor }]}>

                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                  <Text style={[styles.headerText, { color: selectedTheme.mainColor }]}>
                    Adresim
                  </Text>
                </View>
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    region={mapRegion}
                    onPress={(e) => console.log(e.nativeEvent.coordinate)}
                    scrollEnabled={false}
                  >
                    <Marker coordinate={mapRegion} />
                  </MapView>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.bottomBarContainer}>
        <BottomBar onNfc={handleOnNfc} onMapScreen={handleOnMapScreen} onMessages={handleOnMessages} onDepartments={handleDepartments} onPersons={handlePersons} onSettings={handleSettings} onQrScreen={handleQrScreen} activePage="profile" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topView: {
    flex: 1,
  },
  header: {
    paddingTop: 2,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily:'Roboto'
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  responsibleDepartmentItem: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  oldDepartmentItem: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  pdfButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  horizontalScrollView: {
    paddingHorizontal: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  boldText: {
    fontWeight: 'bold',
  },
  profilePhoto: {
    width: '100%',
    height: 60,
    alignItems: 'flex-start',
    marginBottom: 75,
    paddingLeft: 25,
  },
  profilePictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,

  },
  profilePictureContainer2: {
    borderRadius: 75,
    borderWidth: 9,
    position: 'static',
    top: 60,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 5,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapCard: {
    width: '90%',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
    borderWidth: 1,
  },
  line: {
    flex: 1,
    height: 1,
    borderRadius: 50,
    opacity: 0.3,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  }
});

export default MyProfile;
