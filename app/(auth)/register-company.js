import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { createUserIfNotExists } from "../../services/user.service";

export default function RegisterCompany() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [gst, setGst] = useState("");

  const submit = async () => {
    if (!companyName || !address || !gst) {
      Alert.alert("Error", "All fields are mandatory");
      return;
    }

    try {
      await createUserIfNotExists({
        role: "company",
        profileData: {
          companyName,
          address,
          gst,
        },
      });

      Alert.alert("Success", "Company registered");
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Company Name" value={companyName} onChangeText={setCompanyName} />
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput placeholder="GST Number" value={gst} onChangeText={setGst} />
      <Button title="Register" onPress={submit} />
    </View>
  );
}
