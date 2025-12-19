import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

const CompanyProfile = ({ route }) => {
  // Example data fetched from backend
  const [companyName, setCompanyName] = useState("ABC Constructions");
  const [address, setAddress] = useState("123 Main Street, City, State");
  const [gstNumber, setGstNumber] = useState("27AAAAA0000A1Z5");
  const [phone, setPhone] = useState("9876543210");

  const saveProfile = () => {
    // Simple validation
    if (!companyName || !address || !gstNumber || !phone) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert("Error", "Invalid phone number");
      return;
    }
    if (!/^[0-9A-Z]{15}$/.test(gstNumber)) {
      Alert.alert("Error", "Invalid GST Number");
      return;
    }

    Alert.alert("Success", "Profile updated successfully!");
    // TODO: Send updated data to backend
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Company Profile</Text>

      <Text style={styles.label}>Company Name*</Text>
      <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} />

      <Text style={styles.label}>Address*</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} multiline />

      <Text style={styles.label}>GST Number*</Text>
      <TextInput style={styles.input} value={gstNumber} onChangeText={setGstNumber} />

      <Text style={styles.label}>Phone Number*</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", color: "#0a3d62", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", color: "#130f40", marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#c8d6e5",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "#ffffff",
  },
  button: {
    marginTop: 25,
    backgroundColor: "#0a3d62",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default CompanyProfile;
