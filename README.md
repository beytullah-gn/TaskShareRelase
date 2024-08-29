
### Set Up Your `.env` File

Configure your `.env` file with the following keys:

```env
TRANSLATE_API_KEY=
apiKey=
authDomain=
databaseURL=
projectId=
storageBucket=
messagingSenderId=
appId=
measurementId=
uri=
ip_geo_api=
```

### Firebase Configuration

#### Create the Following Tables in the Realtime Database

1. **`/DepartmentEmployees`**
   - `/`{id}
     - `Active`: true
     - `DepartmentId`: {DepartmentId}
     - `EmployeeId`: {PersonId}
     - `EndDate`: "Null"
     - `Permissions`
       - `"Admin"`: true
       - `"ManageDepartments"`: true
       - `"ManagePersons"`: true
       - `"ManageSubjects"`: true
       - `"ManageTasks"`: true
       - `"Read"`: true
       - `"Write"`: true

2. **`/Departments`**
   - `/`{id}
     - `Active`: true
     - `DepartmentDescription`: "Description"
     - `DepartmentId`: "DepartmentId"
     - `DepartmentName`: "Name"
     - `PDFUrl`: "null"
     - `Permissions`
       - `"Admin"`: true
       - `"ManageDepartments"`: true
       - `"ManagePersons"`: true
       - `"ManageTasks"`: true

3. **`/Persons`**
   - `/1`
     - `AccountType`: "Employee"
     - `Name`: "John"
     - `NfcId`: "null"
     - `PersonId`: "PersonId"
     - `Surname`: "Doe"

4. **`/User`**
   - `/ORCo6Dt18LZ0MdPHv6PHVZgPvob2`
     - `EMail`: "johndoe@hotmail.com"
     - `PersonId`: "1"
     - `UserId`: "ORCo6Dt18LZ0MdPHv6PHVZgPvob2"

### Firebase Auth Configuration

1. Create an account with the email `johndoe@hotmail.com` in Firebase Auth.
2. Set the `/User/{id}` field in Firebase Realtime Database to match the Firebase Auth UID.

### You're Ready to Go!

---
