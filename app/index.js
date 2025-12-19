import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();

  const buttonStyle = {
    backgroundColor: "#1E40AF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  };

  const buttonText = {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#1E3A8A" }}>
        Welcome to Buildo
      </Text>

      <TouchableOpacity style={buttonStyle} onPress={() => router.push("/dashboards/ContractorDashboard")}>
        <Text style={buttonText}>Contractor Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyle} onPress={() => router.push("/dashboards/CompanyDashboard")}>
        <Text style={buttonText}>Company Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyle} onPress={() => router.push("/dashboards/CreateLabourTeam")}>
        <Text style={buttonText}>Create Labour Team</Text>
      </TouchableOpacity>
    </View>
  );
}
