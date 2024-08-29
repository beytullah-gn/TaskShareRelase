import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from 'react-redux';
import WifiAnimation from "../Components/WifiAnimation";

const ConnectionWaitingScreen = () => {
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  return (
    <View style={[styles.container, { backgroundColor: selectedTheme.fourthColor }]}>
      <WifiAnimation />
      <Text style={[styles.text, { color: selectedTheme.fifthColor }]}>Bağlantı Bekleniyor...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default ConnectionWaitingScreen;
