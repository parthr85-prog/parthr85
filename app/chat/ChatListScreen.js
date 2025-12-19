import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../../firebase/firebaseConfig";

export default function ChatListScreen() {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderColor: "#e5e7eb"
            }}
            onPress={() =>
              router.push(`/chat/ChatScreen?chatId=${item.id}`)
            }
          >
            <Text style={{ fontWeight: "bold" }}>
              Chat
            </Text>
            <Text>{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
