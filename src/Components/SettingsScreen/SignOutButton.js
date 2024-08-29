import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SignOutButton = ({ onPress, backgroundColor }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button,{borderColor:backgroundColor.whiteColor}]}
  >
    <Text style={[styles.buttonText,{color:backgroundColor.whiteColor}]}>Çıkış Yap</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    padding: 7,
    borderRadius: 2,
    marginVertical: 10,
    borderWidth:1,
  },
  buttonText: {

    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignOutButton;
