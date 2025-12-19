import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth, db } from "../../../firebase/firebaseConfig";

import AdminDashboard from "../dashboards/AdminDashboard";
import CompanyDashboard from "../dashboards/CompanyDashboard";
import ContractorDashboard from "../dashboards/ContractorDashboard";
import LabourDashboard from "../dashboards/LabourDashboard";

export default function Dashboard() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadRole = async () => {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      setRole(snap.data().role);
    };
    loadRole();
  }, []);

  if (!role) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (role === "company") return <CompanyDashboard />;
  if (role === "contractor") return <ContractorDashboard />;
  if (role === "labour_contractor") return <LabourDashboard />;
  if (role === "admin") return <AdminDashboard />;

  return null;
}
