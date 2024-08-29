// Ağaç yapısındaki departmanları oluşturur
export const buildHierarchy = (departments) => {
    const departmentMap = new Map();
    departments.forEach(department => {
      department.children = [];
      departmentMap.set(department.id, department);
    });
    const hierarchy = [];
    departmentMap.forEach(department => {
      if (department.ParentDepartment) {
        const parent = departmentMap.get(department.ParentDepartment);
        if (parent) {
          parent.children.push(department);
        }
      } else {
        hierarchy.push(department);
      }
    });
    return hierarchy;
  };
  
  // Departmanın üst departmanlarını bulur
  export const findAncestors = (departments, targetId) => {
    const ancestors = new Set();
    const findAncestorsRecursively = (id) => {
      const department = departments.find(dep => dep.id === id);
      if (department && department.ParentDepartment) {
        ancestors.add(department.ParentDepartment);
        findAncestorsRecursively(department.ParentDepartment);
      }
    };
    findAncestorsRecursively(targetId);
    return [...ancestors];
  };
  
  // Aranan departmanın ve tüm üst departmanlarını genişletir
  export const findAllExpandedItems = (departments, targetId) => {
    const expandedItems = new Set();
    const findAllExpandedItemsRecursively = (id) => {
      const department = departments.find(dep => dep.id === id);
      if (department) {
        expandedItems.add(id);
        if (department.ParentDepartment) {
          expandedItems.add(department.ParentDepartment);
          findAllExpandedItemsRecursively(department.ParentDepartment);
        }
      }
    };
    findAllExpandedItemsRecursively(targetId);
    return [...expandedItems];
  };

  export const findChildren = (departments, parentId) => {
    return departments.filter(department => department.ParentDepartment === parentId);
};
  