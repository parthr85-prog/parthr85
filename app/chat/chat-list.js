import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { auth, db } from "../../../firebase/firebaseConfig";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setChats(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/chat/chat-room",
              params: { chatId: item.id },
            })
          }
          style={{ padding: 15, borderBottomWidth: 1 }}
        >
          <Text>Chat for Listing: {item.listingId}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
