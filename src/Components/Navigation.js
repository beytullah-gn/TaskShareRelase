import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";  // View ve Text import edildi
import NetInfo from "@react-native-community/netinfo";  // NetInfo import edildi
import '../Services/firebase-config';  
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from "../screens/LoginScreen";
import DepartmentScreen from "../screens/departmentsScreen";
import AddNewDepartment from "../screens/AddNewDepartmentScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MyProfile from "../screens/myProfile";
import PersonsScreen from "../screens/PersonsScreen";
import SelectedDepartment from "../screens/SelectedDepartment";
import SettingsScreen from "../screens/SettingsScreen";
import AddNewPersonScreen from "../screens/AddNewPerson";
import MyDocument from "../screens/MyDocument";
import EntryScreen from "../screens/EntryScreen";
import EntryDocument from "../screens/entryMyDocument";
import SelectedPerson from "../screens/selectedPersonScreen";
import QRCodeScannerScreen from "../screens/qrScreen";
import Messages from "../screens/MessagesScreen";
import NewMessage from "../screens/newMessage";
import SelectedRequest from "../screens/selectedRequest";
import MapScreen from "../screens/mapScreen";
import NfcScreen from "../screens/NfcScreen";
import ConnectionWaitingScreen from "../screens/ConnectionWaitingScreen";
import {  useSelector } from 'react-redux';


const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();


function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(true); // İnternet bağlantı durumu için state
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    // İnternet bağlantısını dinlemek için NetInfo kullanımı
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
      unsubscribeNetInfo();  // NetInfo dinleyicisini temizlemek için
    };
  }, []);

  const screenOptions = {
    headerStyle: { backgroundColor: selectedTheme.mainColor },
    headerTintColor: '#fff',
    statusBarColor: selectedTheme.mainColor,
    navigationBarColor: selectedTheme.mainColor, 
    // navigationBarColor: selectedTheme.mainColor, // Bu ayar React Navigation tarafından genellikle desteklenmez.
  };

  // Eğer internet bağlantısı yoksa "Bağlantı Bekleniyor" mesajını göster
  if (!isConnected) {
    return <ConnectionWaitingScreen />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="MyProfile" component={MyProfile} options={{ headerShown: false, }} />
          <Stack.Screen name="Departments" component={DepartmentScreen} options={{ headerShown: false,  }} />
          <Stack.Screen name="AddNewDepartment" component={AddNewDepartment} options={{ title: "Yeni Departman Oluştur",  headerTintColor: '#fff',  }} />
          <Stack.Screen name="Persons" component={PersonsScreen} options={{ headerShown: false,  }} />
          <Stack.Screen name="SelectedDepartment" component={SelectedDepartment} options={{ title: 'Seçili Departman',  headerTintColor: '#fff',  }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false,  }} />
          <Stack.Screen name="AddPerson" component={AddNewPersonScreen} options={{ title: "Yeni Kişi Ekle",  headerTintColor: '#fff',  }} />
          <Stack.Screen name="MyDocument" component={MyDocument} options={{ title: "Görev Dökümantasyonu",  headerTintColor: '#fff',  }} />
          <Stack.Screen name="SelectedPerson" component={SelectedPerson} options={({ route }) => ({
            title: `${route.params.person.Name} ${route.params.person.Surname}`,
             headerTintColor: '#fff', 
          })} />
          <Stack.Screen name="QrScreen" component={QRCodeScannerScreen} options={{ title: "Yeni Departman Oluştur", headerShown: false,  }} />
          <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false,  }} />
          <Stack.Screen name="NewMessage" component={NewMessage} options={{ title: "Yeni Talep Oluştur",  headerTintColor: '#fff',  }} />
          <Stack.Screen name="SelectedRequest" component={SelectedRequest} options={{ title: "Talep",  headerTintColor: '#fff',  }} />
          <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false,  }} />
          <Stack.Screen name="NfcScreen" component={NfcScreen} options={{ headerShown: false,  }} />
        </Stack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={screenOptions}>
          <AuthStack.Screen name="EntryScreen" component={EntryScreen} options={{ headerShown: false,  }} />
          <AuthStack.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Giriş Ekranı",  headerTintColor: '#fff',  }} />
          <AuthStack.Screen name="EntryDocument" component={EntryDocument} options={{ title: "Dökümantasyon",  headerTintColor: '#fff',  }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default Navigation;
