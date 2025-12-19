import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createUserIfNotExists } from "../../services/user.service";

export default function RegisterContractor() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [gst, setGst] = useState("");

  const submit = async () => {
    if (!name || !address || aadhaar.length !== 12) {
      Alert.alert("Error", "Invalid details");
      return;
    }

    try {
      await createUserIfNotExists({
        role: "contractor",
        profileData: {
          name,
          address,
          aadhaar,
          gst: gst || null,
        },
      });

      Alert.alert("Success", "Contractor registered");
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ padding: 24 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput placeholder="Aadhaar" value={aadhaar} onChangeText={setAadhaar} maxLength={12} />
      <TextInput placeholder="GST (Optional)" value={gst} onChangeText={setGst} />
      <TouchableOpacity onPress={submit}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
