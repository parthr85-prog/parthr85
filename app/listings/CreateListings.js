import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../../../firebase/firebaseConfig";
import { uploadFile } from "../../firebase/storageService";
import { createListingService } from "../../services/listing.service";

export default function CreateListing() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimitDays, setTimeLimitDays] = useState("");
  const [valueINR, setValueINR] = useState("");
  const [type, setType] = useState("project");
  const [documents, setDocuments] = useState([]);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      setDocuments((prev) => [...prev, result.assets[0]]);
    }
  };

  const submitListing = async () => {
    if (!title || !description || !timeLimitDays || !valueINR) {
      Alert.alert("Error", "All fields are mandatory");
      return;
    }

    try {
      const uploadedDocs = [];

      for (const file of documents) {
        const url = await uploadFile(
          file.uri,
          `listings/${auth.currentUser.uid}/${Date.now()}_${file.name}`
        );
        uploadedDocs.push({ name: file.name, url });
      }

      await createListingService({
        title,
        description,
        timeLimitDays: Number(timeLimitDays),
        valueINR: Number(valueINR),
        type,
        documents: uploadedDocs,
      });

      Alert.alert("Success", "Listing created");
      router.back();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 15 }}>
        Create Job / Project
      </Text>

      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8 }} />

      <Text>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Text>Time Limit (days)</Text>
      <TextInput
        value={timeLimitDays}
        onChangeText={setTimeLimitDays}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Text>Value (₹)</Text>
      <TextInput
        value={valueINR}
        onChangeText={setValueINR}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Button title="Upload Documents" onPress={pickDocument} />

      {documents.map((d, i) => (
        <Text key={i}>📄 {d.name}</Text>
      ))}

      <View style={{ marginTop: 20 }}>
        <Button title="Submit Listing" onPress={submitListing} />
      </View>
    </ScrollView>
  );
}
