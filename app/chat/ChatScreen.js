import { useLocalSearchParams } from "expo-router";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../../../firebase/firebaseConfig";

export default function ChatScreen({ userId }) {
  const { conversationId, name } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = async () => {
    if (!text) return;

    try {
      await addDoc(collection(db, "conversations", conversationId, "messages"), {
        text,
        senderId: userId,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.message, item.senderId === userId ? styles.sent : styles.received]}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <Text style={styles.heading}>{name}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  message: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: "80%",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#0ea5e9",
    color: "#fff",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#e2e8f0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 45,
  },
});
