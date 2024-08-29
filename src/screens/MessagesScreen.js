import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";
import BottomBar from "../Components/BottomBar";
import { Ionicons } from '@expo/vector-icons';
import { fetchRequests } from "../Services/fetchRequests";
import { useSelector } from "react-redux";

const MessagesScreen = ({ navigation }) => {
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current'); // State to track the active tab

  useEffect(() => {
    const handleRequestsUpdate = (fetchedRequests) => {
      setRequests(fetchedRequests);
      setLoading(false);
    };

    fetchRequests(handleRequestsUpdate);

    return () => {};
  }, []);

  const handleDepartments = () => {
    navigation.navigate('Departments');
  };

  const handleProfile = () => {
    navigation.navigate('MyProfile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleQrScreen = () => {
    navigation.navigate('QrScreen');
  };

  const handlePersons = () => {
    navigation.navigate('Persons');
  };
  const handleOnMap = () => {
    navigation.navigate('MapScreen');
  };

  const handleNewRequest = () => {
    navigation.navigate('NewMessage');
  };

  const handleRequestPress = (request) => {
    navigation.navigate("SelectedRequest", { request });
  };
  const handleOnNfc=()=>{
    navigation.navigate("NfcScreen")
  }

  // Filter requests based on the active tab
  const filteredRequests = requests.filter(request =>
    activeTab === 'current' ? !request.Completed : request.Completed
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: selectedTheme.thirdColor }]}>
      <View style={[styles.tabContainer, { backgroundColor: selectedTheme.mainColor }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'current' && styles.activeTab,{borderColor:selectedTheme.thirdColor}]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'current' && styles.activeTabText ,{color:selectedTheme.thirdColor}]}>
            Güncel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'archive' && styles.activeTab,{borderColor:selectedTheme.thirdColor}]}
          onPress={() => setActiveTab('archive')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'archive' && styles.activeTabText,{color:selectedTheme.thirdColor}]}>
            Arşiv
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{justifyContent:'center',alignItems:'center',paddingHorizontal:30}}>
        <Text style={[styles.loadingText, { color: selectedTheme.fifthColor, fontWeight:'bold'}]}>
              Talep detaylarını görmek için bir talebe tıklayın. Yeni talep oluşturmak için "+"
        </Text>
      </View>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={[styles.requestsContainer, { paddingBottom: 120 }]}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={selectedTheme.fifthColor} />
              <Text style={[styles.loadingText, { color: selectedTheme.fifthColor }]}>
                Yükleniyor...
              </Text>
            </View>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.requestCard, { backgroundColor: selectedTheme.fourthColor }]}
                onPress={() => handleRequestPress(request)}
              >
                <Text style={[styles.requestText, { color: selectedTheme.fifthColor }]}>
                  {request.Details}
                </Text>
                <Text style={[styles.senderText, { color: selectedTheme.mainColor }]}>
                  Gönderen: {request.senderName}
                </Text>
                <Text style={[styles.departmentText, { color: selectedTheme.mainColor }]}>
                  Departman: {request.departmentName}
                </Text>
                <Text style={[styles.timestampText, { color: selectedTheme.mainColor }]}>
                  Oluşturulma tarihi: {request.createdTime}
                </Text>
                <Text style={[styles.timestampText, { color: selectedTheme.mainColor }]}>
                  Güncellenme tarihi: {request.updatedTime}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: selectedTheme.fifthColor }]}>
                Mesaj bulunamadı
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[styles.newRequestButton, { backgroundColor: selectedTheme.fifthColor }]}
        onPress={handleNewRequest}
      >
        <Ionicons name="add" size={24} color={selectedTheme.whiteColor} />
      </TouchableOpacity>

      <BottomBar
        onProfile={handleProfile}
        onDepartments={handleDepartments}
        onSettings={handleSettings}
        onQrScreen={handleQrScreen}
        onPersons={handlePersons}
        onMapScreen={handleOnMap}
        onNfc={handleOnNfc}
        activePage="messages"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 10,
    paddingBottom: 80,
  },
  requestsContainer: {
    padding: 10,
    paddingBottom: 120, // Extra padding to avoid overlap with the bottom bar
  },
  requestCard: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Elevation for Android
  },
  requestText: {
    fontSize: 17,
    fontWeight: '500',
  },
  senderText: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: 5,
  },
  departmentText: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: 5,
  },
  timestampText: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newRequestButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 90,
    right: 20,
  },
});

export default MessagesScreen;
