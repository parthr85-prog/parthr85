import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { auth, db } from "../../../firebase/firebaseConfig";

export default function ProfileScreen() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gst, setGst] = useState("");
  const [aadhaar, setAadhaar] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const ref = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setRole(data.role);
      setName(data.name || "");
      setAddress(data.address || "");
      setPhone(data.phone || "");
      setGst(data.gst || "");
      setAadhaar(data.aadhaar || "");
    }
    setLoading(false);
  };

  const validateProfile = () => {
    if (!name || !address || !phone) {
      Alert.alert("Error", "Name, Address and Phone are mandatory");
      return false;
    }

    if (role === "company" && !gst) {
      Alert.alert("Error", "GST Number is mandatory for Company");
      return false;
    }

    if (role !== "company" && !aadhaar) {
      Alert.alert("Error", "Aadhaar Number is mandatory");
      return false;
    }

    return true;
  };

  const saveProfile = async () => {
    if (!validateProfile()) return;

    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        name,
        address,
        phone,
        gst: role === "company" ? gst : "",
        aadhaar: role !== "company" ? aadhaar : "",
        profileCompleted: true
      });

      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name / Company Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {role === "company" && (
        <TextInput
          style={styles.input}
          placeholder="GST Number"
          value={gst}
          onChangeText={setGst}
        />
      )}

      {role !== "company" && (
        <TextInput
          style={styles.input}
          placeholder="Aadhaar Number"
          keyboardType="numeric"
          value={aadhaar}
          onChangeText={setAadhaar}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff"
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
