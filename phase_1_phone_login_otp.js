// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import LoginScreen from "./screens/LoginScreen";
import RoleScreen from "./screens/RoleScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Role" component={RoleScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// screens/RoleScreen.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";

const roles = [
  "Labour Contractor",
  "Contractor",
  "Company"
];

export default function RoleScreen() {
  const selectRole = async (role) => {
    const uid = auth.currentUser.uid;
    await setDoc(doc(db, "users", uid), {
      role,
      phone: auth.currentUser.phoneNumber,
      createdAt: new Date()
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        Select Your Role
      </Text>

      {roles.map((r) => (
        <TouchableOpacity
          key={r}
          onPress={() => selectRole(r)}
          style={{
            padding: 16,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12
          }}
        >
          <Text style={{ fontSize: 16 }}>{r}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
