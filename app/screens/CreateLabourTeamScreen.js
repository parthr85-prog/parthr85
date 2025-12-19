import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { firestore, auth } from "../firebase"; // Make sure your firebase.js exports these
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateLabourTeamScreen({ navigation }) {
  const [trade, setTrade] = useState("");
  const [workersCount, setWorkersCount] = useState("");
  const [ratePerDay, setRatePerDay] = useState("");
  const [available, setAvailable] = useState(true);

  const handleSubmit = async () => {
    if (!trade || !workersCount || !ratePerDay) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const docRef = await addDoc(collection(firestore, "labourTeams"), {
        ownerId: auth.currentUser.uid,
        trade,
        workersCount: Number(workersCount),
        ratePerDay: Number(ratePerDay),
        available,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Labour team created!");
      navigation.goBack(); // Go back to dashboard
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Could not create labour team.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Trade (e.g., Mason, Carpenter)</Text>
      <TextInput
        style={styles.input}
        value={trade}
        onChangeText={setTrade}
      />

      <Text style={styles.label}>Number of Workers</Text>
      <TextInput
        style={styles.input}
        value={workersCount}
        onChangeText={setWorkersCount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Rate Per Day</Text>
      <TextInput
        style={styles.input}
        value={ratePerDay}
        onChangeText={setRatePerDay}
        keyboardType="numeric"
      />

      <Button title="Create Labour Team" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 10, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 5, borderRadius: 5 },
});
