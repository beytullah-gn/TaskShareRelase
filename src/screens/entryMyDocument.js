import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Pdf from "react-native-pdf";
import { StyleSheet, View, Text } from "react-native";
import { useSelector } from 'react-redux';

const EntryDocument = ({ route }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  useEffect(() => {
    if (route.params && route.params.pdfUrl) {
      // URL'yi kontrol et ve set et
      console.log("PDF URL:", route.params.pdfUrl);
      setPdfUrl(route.params.pdfUrl);
    }
  }, [route.params]);

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:selectedTheme.thirdColor }}>
      <View style={[styles.container, { backgroundColor: selectedTheme.thirdColor }]}>
        {pdfUrl ? (
          <Pdf
            trustAllCerts={false}
            source={{
              uri: pdfUrl,
              cache: false,  // Cache'i kapalı yapmayı deneyin
            }}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
              console.log("PDF Error:", error);
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={[styles.pdf,{backgroundColor:selectedTheme.thirdColor}]}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={{ color: selectedTheme.mainColor }}>PDF bulunamadı...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EntryDocument;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
