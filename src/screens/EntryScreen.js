import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text as RNText, TouchableOpacity } from "react-native";
import { Appbar } from 'react-native-paper';
import TreeCardItem from "../Components/entryScreenTreeCardItem";
import { buildHierarchy } from "../Services/DepartmentUtils";
import fetchDepartments from "../Services/fetchActiveDepartments";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { useSelector } from 'react-redux';

const EntryScreen = ({ navigation }) => {
  const [allDepartments, setAllDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState([]);
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departments = await fetchDepartments();
        const hierarchicalDepartments = buildHierarchy(departments);
        setAllDepartments(hierarchicalDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const handleToggleExpand = (id) => {
    setExpandedItems((prevExpandedItems) =>
      prevExpandedItems.includes(id)
        ? prevExpandedItems.filter((itemId) => itemId !== id)
        : [...prevExpandedItems, id]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <RNText style={[styles.loadingText, { color: selectedTheme.mainColor }]}>Yükleniyor...</RNText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: selectedTheme.thirdColor }]}>
      <Appbar.Header style={[styles.header, { backgroundColor: selectedTheme.mainColor }]}>
        <Appbar.Content 
          title="TaskShare" 
          titleStyle={[styles.headerTitle, { color: selectedTheme.whiteColor }]}
        />
        <View style={styles.loginContainer}>
          <TouchableOpacity 
            mode="contained"
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.loginButton}
          >
            <Icon name="login" size={35} color={selectedTheme.fourthColor} />
          </TouchableOpacity>
        </View>
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        {allDepartments.map((item) => (
          <TreeCardItem
            key={item.id}
            item={item}
            expandedItems={expandedItems}
            onToggleExpand={handleToggleExpand}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    marginRight: 10,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
});

export default EntryScreen;
