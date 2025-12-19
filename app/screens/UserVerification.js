import { doc, updateDoc } from "firebase/firestore";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../firebase/firebaseConfig";

export default function UserVerification({ route, navigation }) {
  const { user } = route.params;

  const verifyUser = async () => {
    await updateDoc(doc(db, "users", user.id), {
      verified: true,
    });
    Alert.alert("User Verified");
    navigation.goBack();
  };

  const rejectUser = async () => {
    await updateDoc(doc(db, "users", user.id), {
      verified: false,
    });
    Alert.alert("User Rejected");
    navigation.goBack();
  };
  const activateSubscription = async () => {
  await updateDoc(doc(db, "users", user.id), {
    subscriptionActive: true,
    subscriptionRequested: false,
  });
  alert("Subscription Activated");
};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Verification</Text>

      <Text>Name: {user.name}</Text>
      <Text>Role: {user.role}</Text>
      <Text>Phone: {user.phone}</Text>

      {user.gstNumber && <Text>GST: {user.gstNumber}</Text>}
      {user.aadhaarNumber && <Text>Aadhaar: {user.aadhaarNumber}</Text>}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.approve} onPress={verifyUser}>
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reject} onPress={rejectUser}>
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={{ backgroundColor: "#2980b9", padding: 15, marginTop: 15 }}
  onPress={activateSubscription}
>
  <Text style={{ color: "#fff", textAlign: "center" }}>
    Activate Subscription
  </Text>
</TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  approve: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  reject: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
