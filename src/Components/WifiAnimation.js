// WifiAnimation.js
import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

const WifiAnimation = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.Image
        source={require("../../assets/wifi.png")} // Burada animasyon için bir Wi-Fi simgesi kullanılıyor
        style={{ width: 100, height: 100, transform: [{ rotate: spin }] }}
      />
    </View>
  );
};

export default WifiAnimation;
