import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SubscriptionBlocked({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription Required</Text>

      <Text style={styles.text}>
        Your subscription is inactive.
        Please activate to continue using this feature.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Subscription")}
      >
        <Text style={styles.buttonText}>View Plans</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#f5f6fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#0a3d62",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
