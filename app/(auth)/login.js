import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buildo</Text>
      <Text style={styles.subtitle}>Login with Mobile Number</Text>

      <TextInput
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: "/(auth)/otp", params: { phone } })}
      >
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subtitle: { textAlign: "center", marginBottom: 20, color: "#555" },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 20 },
  button: { backgroundColor: "#2563eb", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});
