import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import FetchDepartments from '../Services/fetchDepartments';
import TreeCardItem from '../Components/TreeCardItem';
import { buildHierarchy, findAncestors, findAllExpandedItems } from '../Services/DepartmentUtils';
import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar from '../Components/BottomBar';
import { fetchDepartmentEmployeeData } from '../Services/fetchDepartmentEmployees';
import { useSelector } from 'react-redux';

const DepartmentScreen = ({ navigation }) => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);

  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  // Function to check permissions and update state accordingly
  const checkPermissions = async () => {
    setIsLoading(true); // Show loading indicator while checking permissions
    try {
      const departmentEmployee = await fetchDepartmentEmployeeData();
      if (departmentEmployee && departmentEmployee.Permissions && departmentEmployee.Permissions.ManageDepartments) {
        setShowAddButton(true);
      } else {
        setShowAddButton(false);
      }
    } catch (error) {
      console.log("Error fetching department: ", error);
      setShowAddButton(false);
    } finally {
      setIsLoading(false); // Hide loading indicator once done
    }
  };

  useEffect(() => {
    checkPermissions(); // Call permission check on mount
  }, []);

  const filteredDepartments = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const matchingDepartments = departments.filter(department =>
      department.DepartmentName.toLowerCase().includes(lowercasedSearchTerm) ||
      department.DepartmentDescription.toLowerCase().includes(lowercasedSearchTerm)
    );

    if (matchingDepartments.length === 0) {
      return [];
    }

    const ancestorIds = new Set(matchingDepartments.flatMap(dep => findAncestors(departments, dep.id)));
    const allIdsToInclude = new Set([...matchingDepartments.map(dep => dep.id), ...ancestorIds]);

    const filterDepartments = (deps) => {
      return deps
        .filter(department => allIdsToInclude.has(department.id))
        .map(department => ({
          ...department,
          children: filterDepartments(department.children || []),
        }));
    };

    return filterDepartments(buildHierarchy(departments));
  }, [departments, searchTerm]);

  const handleToggleExpand = useCallback((id) => {
    setExpandedItems(prevItems =>
      prevItems.includes(id) ? prevItems.filter(item => item !== id) : [...prevItems, id]
    );
  }, []);

  const handleProfile = () => {
    navigation.navigate('MyProfile');
  };
  const handleDepartments = () => {
    navigation.navigate('Departments');
  };
  const handlePersons = () => {
    navigation.navigate('Persons');
  };
  const handleSettings = () => {
    navigation.navigate('Settings');
  };
  const handleQrScreen = () => {
    navigation.navigate('QrScreen');
  };
  const handleOnMessages = () => {
    navigation.navigate('Messages');
  };
  const handleOnMapScreen = () => {
    navigation.navigate('MapScreen');
  };
  const handleOnNfc=()=>{
    navigation.navigate("NfcScreen")
  }

  useEffect(() => {
    if (searchTerm) {
      const matchingDepartments = departments.filter(department =>
        department.DepartmentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchingDepartments.length > 0) {
        const newExpandedItems = matchingDepartments.flatMap(dep =>
          findAllExpandedItems(departments, dep.id)
        );
        setExpandedItems(newExpandedItems);
      }
    } else {
      const rootDepartments = departments.filter(department => !department.ParentDepartment);
      const rootExpandedItems = rootDepartments.map(dep => dep.id);
      setExpandedItems(rootExpandedItems);
    }
  }, [searchTerm, departments]);

  const renderTree = useCallback(() => {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          style={styles.innerScrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredDepartments.map((item) => (
            <TreeCardItem
              key={item.id}
              item={item}
              expandedItems={expandedItems}
              onToggleExpand={handleToggleExpand}
              searchTerm={searchTerm}
              level={0}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      </ScrollView>
    );
  }, [filteredDepartments, expandedItems, handleToggleExpand, searchTerm, navigation]);

  const AddNewDepartment = () => {
    navigation.navigate("AddNewDepartment");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: selectedTheme.thirdColor }]}>
      <View style={[styles.headerContainer, { backgroundColor: selectedTheme.mainColor }]}>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { borderColor: selectedTheme.secondaryColor, color: selectedTheme.mainColor, backgroundColor: selectedTheme.whiteColor }]}
            placeholder="Departman Ara..."
            placeholderTextColor={selectedTheme.secondaryColor}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity style={[styles.clearButton, { backgroundColor: selectedTheme.secondaryColor }]} onPress={() => setSearchTerm('')}>
            <Text style={[styles.clearButtonText, { color: selectedTheme.whiteColor }]}>Temizle</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{justifyContent:'center',alignItems:'center',paddingBottom:5}}>
      <Text style={[{ color: selectedTheme.fifthColor, fontWeight:'bold'}]}>
          Departman detayları için "i" butonuna tıklayın.
        </Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {isLoading ? (
          <ActivityIndicator size="large" color={selectedTheme.mainColor} />
        ) : (
          <>
            <FetchDepartments setDepartments={setDepartments} setIsLoading={setIsLoading} />
            {renderTree()}
          </>
        )}
      </ScrollView>
      {showAddButton && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={[styles.bottomButton, { backgroundColor: selectedTheme.fifthColor }]} onPress={AddNewDepartment}>
            <Text style={[styles.bottomText, { color: selectedTheme.whiteColor }]}>Yeni Departman Oluştur</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.bottomBarContainer}>
        <BottomBar onNfc={handleOnNfc} onMapScreen={handleOnMapScreen} onMessages={handleOnMessages} onQrScreen={handleQrScreen} onProfile={handleProfile} onDepartments={handleDepartments} onPersons={handlePersons} onSettings={handleSettings} activePage="departments" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    height: 40,
  },
  clearButton: {
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  innerScrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  bottomContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomButton: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 3,
  },
  bottomText: {
    fontWeight: 'bold',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
});

export default DepartmentScreen;
