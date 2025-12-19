import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db, storage } from "../../firebase/firebaseConfig";

export default function ChatScreen({ route, navigation }) {
  const { chatId, listingId, listingTitle } = route.params;
  const currentUserId = auth.currentUser.uid;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // 🔹 Load messages
  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsubscribe;
  }, []);

  // 🔹 Send text message
  const sendTextMessage = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      type: "text",
      text: newMessage,
      senderId: currentUserId,
      createdAt: serverTimestamp(),
    });

    setNewMessage("");
  };

  // 🔹 Pick image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadFile(result.assets[0].uri, "image");
    }
  };

  // 🔹 Pick document
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    if (!result.canceled) {
      uploadFile(
        result.assets[0].uri,
        "file",
        result.assets[0].name
      );
    }
  };

  // 🔹 Upload file
  const uploadFile = async (uri, type, fileName = "file") => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileRef = ref(
      storage,
      `chatAttachments/${chatId}/${Date.now()}-${fileName}`
    );

    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);

    await addDoc(collection(db, "chats", chatId, "messages"), {
      type,
      fileUrl: downloadURL,
      fileName,
      senderId: currentUserId,
      createdAt: serverTimestamp(),
    });
  };

  // 🔹 Open file or image
  const openFile = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Cannot open this file");
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.senderId === currentUserId;

    return (
      <View
        style={[
          styles.message,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {item.type === "text" && (
          <Text style={styles.text}>{item.text}</Text>
        )}

        {item.type === "image" && (
          <TouchableOpacity onPress={() => setPreviewImage(item.fileUrl)}>
            <Image source={{ uri: item.fileUrl }} style={styles.image} />
            <Text style={styles.openHint}>Tap to view</Text>
          </TouchableOpacity>
        )}

        {item.type === "file" && (
          <TouchableOpacity onPress={() => openFile(item.fileUrl)}>
            <Text style={styles.file}>
              📄 {item.fileName || "Open File"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.project}>Project: {listingTitle}</Text>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
      />

      {/* Image Preview Modal */}
      <Modal visible={!!previewImage} transparent>
        <View style={styles.previewContainer}>
          <TouchableOpacity onPress={() => setPreviewImage(null)}>
            <Text style={styles.close}>✖ Close</Text>
          </TouchableOpacity>
          <Image source={{ uri: previewImage }} style={styles.previewImage} />
        </View>
      </Modal>

      <View style={styles.row}>
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.attach}>🖼️</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={pickDocument}>
          <Text style={styles.attach}>📎</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Message"
          value={newMessage}
          onChangeText={setNewMessage}
        />

        <TouchableOpacity onPress={sendTextMessage}>
          <Text style={styles.send}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  project: { textAlign: "center", color: "#555", padding: 5 },
  message: {
    padding: 10,
    borderRadius: 10,
    margin: 5,
    maxWidth: "75%",
  },
  myMessage: {
    backgroundColor: "#0a3d62",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#dcdde1",
    alignSelf: "flex-start",
  },
  text: { color: "#fff" },
  image: { width: 200, height: 200, borderRadius: 10 },
  file: { fontWeight: "bold", color: "#000" },
  openHint: { fontSize: 11, color: "#555", textAlign: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  attach: { fontSize: 22, marginHorizontal: 5 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  send: {
    color: "#0a3d62",
    fontWeight: "bold",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
  close: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
});
