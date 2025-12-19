import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RegisterRole() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/(auth)/register-company")}>
        <Text>Company</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/(auth)/register-contractor")}>
        <Text>Contractor</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/(auth)/register-labour")}>
        <Text>Labour Contractor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12
  }
});
