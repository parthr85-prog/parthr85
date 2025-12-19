import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../../firebase/firebaseConfig";

export default function CreateLabourTeam() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [skill, setSkill] = useState("");

  const addLabour = async () => {
    if (!name || !phone || !skill) return Alert.alert("All fields are required");
    await addDoc(collection(db, "labourTeams"), { name, phone, skill });
    Alert.alert("Labour Added Successfully");
    setName(""); setPhone(""); setSkill("");
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F1F5F9" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1E40AF", marginBottom: 20 }}>
        Create Labour Team
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#CBD5E1",
          borderRadius: 10,
          padding: 12,
          marginBottom: 15,
          backgroundColor: "white"
        }}
      />

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={{
          borderWidth: 1,
          borderColor: "#CBD5E1",
          borderRadius: 10,
          padding: 12,
          marginBottom: 15,
          backgroundColor: "white"
        }}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Skill"
        value={skill}
        onChangeText={setSkill}
        style={{
          borderWidth: 1,
          borderColor: "#CBD5E1",
          borderRadius: 10,
          padding: 12,
          marginBottom: 20,
          backgroundColor: "white"
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#1E40AF",
          padding: 15,
          borderRadius: 12,
        }}
        onPress={addLabour}
      >
        <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>Add Labour</Text>
      </TouchableOpacity>
    </View>
  );
}
