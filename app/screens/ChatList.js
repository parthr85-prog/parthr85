import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";

export default function ChatList({ navigation }) {
  const currentUserId = auth.currentUser.uid;
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      orderBy("lastUpdated", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((chat) =>
          chat.participants.includes(currentUserId)
        );

      setChats(list);
    });

    return unsub;
  }, []);

  const renderItem = ({ item }) => {
    const unread =
      item.unreadCount?.[currentUserId] || 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ChatScreen", {
            chatId: item.id,
            listingId: item.listingId,
            listingTitle: item.listingTitle,
          })
        }
      >
        <Text style={styles.lastMessage}>
          {item.lastMessage || "New chat"}
        </Text>

        {unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
