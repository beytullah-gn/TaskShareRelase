
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

### AndroidManifest Configuration

In addition to the above setup, you will also need to make changes to the `AndroidManifest.xml` file in your Android project to ensure proper configuration. These changes might include:

1. **Internet Permissions:**
   - Ensure that your app has permission to access the internet:
     ```xml
     <uses-permission android:name="android.permission.INTERNET" />
     ```

2. **Access to Network State (Optional):**
   - If you need to check network status, add:
     ```xml
     <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
     ```

3. **Firebase Services:**
   - Make sure that Firebase services are correctly initialized by adding the following inside the `<application>` tag:
     ```xml
     <meta-data
         android:name="com.google.firebase.messaging.default_notification_channel_id"
         android:value="@string/default_notification_channel_id" />
     <meta-data
         android:name="com.google.firebase.analytics.APP_MEASUREMENT_EVENT_ID"
         android:value="id" />
     ```

4. **Google Maps or Location Services (if used):**
   - If your application uses Google Maps or location services:
     ```xml
     <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
     <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
     <meta-data android:name="com.google.android.geo.API_KEY" android:value="TRANSLATE_API_KEY"/>
     ```

### You're Ready to Go!

---
