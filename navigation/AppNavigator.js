import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { db } from "../firebase";

import LoginScreen from "../screens/LoginScreen";
import RoleScreen from "../screens/RoleScreen";
import LoadingScreen from "../screens/LoadingScreen";

import LabourDashboard from "../dashboards/LabourDashboard";
import ContractorDashboard from "../dashboards/ContractorDashboard";
import CompanyDashboard from "../dashboards/CompanyDashboard";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(auth.currentUser);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRole = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setRole(snap.data().role);
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  if (!user) return <LoginScreen />;
  if (loading) return <LoadingScreen />;
  if (!role) return <RoleScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === "Labour Contractor" && (
        <Stack.Screen name="Labour" component={LabourDashboard} />
      )}
      {role === "Contractor" && (
        <Stack.Screen name="Contractor" component={ContractorDashboard} />
      )}
      {role === "Company" && (
        <Stack.Screen name="Company" component={CompanyDashboard} />
      )}
    </Stack.Navigator>
  );
}
