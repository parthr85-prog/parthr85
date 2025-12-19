import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../../firebase/firebaseConfig";
import { activateMonthlySubscription } from "../../firebase/subscriptionUtils";

export default function SubscriptionScreen() {
  const router = useRouter();

  const handleSubscribe = async () => {
    try {
      await activateMonthlySubscription(auth.currentUser.uid);
      Alert.alert("Success", "Subscription activated");
      router.replace("/dashboards");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade Required</Text>

      <View style={styles.card}>
        <Text style={styles.plan}>Monthly Plan</Text>
        <Text style={styles.price}>₹999 / month</Text>
        <Text style={styles.desc}>
          ✔ View Profiles{"\n"}
          ✔ Post Listings{"\n"}
          ✔ Bid on Listings{"\n"}
          ✔ Chat Access{"\n"}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
          <Text style={styles.buttonText}>Activate Subscription</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16
  },
  plan: {
    fontSize: 20,
    fontWeight: "bold"
  },
  price: {
    fontSize: 18,
    color: "#16a34a",
    marginVertical: 10
  },
  desc: {
    marginBottom: 20,
    lineHeight: 22
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
