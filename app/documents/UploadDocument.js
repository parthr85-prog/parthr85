import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { auth, db } from "../../../firebase/firebaseConfig";
import { storage } from "../../firebase/storageConfig";

export default function UploadDocument() {
  const { listingId } = useLocalSearchParams();
  const [uploading, setUploading] = useState(false);

  const pickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true
      });

      if (result.canceled) return;

      setUploading(true);

      const file = result.assets[0];
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const storageRef = ref(
        storage,
        `documents/${listingId}/${Date.now()}_${file.name}`
      );

      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "documents"), {
        listingId,
        name: file.name,
        url,
        uploadedBy: auth.currentUser.uid,
        createdAt: Timestamp.now()
      });

      Alert.alert("Success", "Document uploaded");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload Document</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={pickAndUpload}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? "Uploading..." : "Select & Upload File"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "bold" }
});
