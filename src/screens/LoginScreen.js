import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { login } from '../Auth/AuthService';
import { styles } from '../styles/loginscreenStyle';
import { auth } from '../Services/firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useSelector } from 'react-redux';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { user, token } = await login(email, password);
      setPassword('');
      setEmail('');
    } catch (error) {
      Alert.alert('Giriş Hatası', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert('Başarılı', 'Şifre sıfırlama e-postası gönderildi.');
      setResetEmail('');
      setPasswordModalVisible(false);
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: selectedTheme.thirdColor }]}>
      <Text style={[styles.title, { color: selectedTheme.mainColor }]}>Giriş Yap</Text>
      
      <TextInput
        style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        cursorColor={selectedTheme.mainColor}
      />
      
      <TextInput
        style={[styles.input, { backgroundColor: selectedTheme.fourthColor }]}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        cursorColor={selectedTheme.mainColor}
      />
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: selectedTheme.mainColor }]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Yükleniyor...' : 'Giriş Yap'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.registerContainer} 
        onPress={() => setPasswordModalVisible(true)}
      >
        <Text style={[styles.registerText, { color: selectedTheme.mainColor }]}>Şifremi unuttum.</Text>
      </TouchableOpacity>
      
      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: selectedTheme.whiteColor }]}>
            <Text style={[styles.modalTitle, { color: selectedTheme.mainColor }]}>Şifre Sıfırlama</Text>
            <TextInput
              style={[styles.modalInput, { borderColor: selectedTheme.fourthColor }]}
              placeholder="Email adresinizi girin"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: selectedTheme.mainColor }]}
              onPress={handleForgotPassword}
            >
              <Text style={styles.modalButtonText}>E-Posta Gönder</Text>
            </TouchableOpacity>
            <Button title="Kapat" onPress={() => setPasswordModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;
