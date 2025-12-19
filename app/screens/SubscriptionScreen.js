import { doc, updateDoc } from "firebase/firestore";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";

export default function SubscriptionScreen() {
  const activateRequest = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      subscriptionRequested: true,
    });
    Alert.alert("Request Sent", "Admin will activate your subscription");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Subscription</Text>

      <View style={styles.card}>
        <Text style={styles.plan}>Monthly Plan</Text>
        <Text>₹2,999 / month</Text>
        <TouchableOpacity style={styles.button} onPress={activateRequest}>
          <Text style={styles.btnText}>Request Activation</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.plan}>Yearly Plan</Text>
        <Text>₹29,999 / year</Text>
        <TouchableOpacity style={styles.button} onPress={activateRequest}>
          <Text style={styles.btnText}>Request Activation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  plan: { fontSize: 18, fontWeight: "bold" },
  button: {
    marginTop: 15,
    backgroundColor: "#27ae60",
    padding: 12,
    borderRadius: 8,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
