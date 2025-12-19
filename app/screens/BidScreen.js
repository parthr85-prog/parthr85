import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";

export default function BidScreen({ route, navigation }) {
  const { listingId, listingTitle, ownerId } = route.params;

  const currentUserId = auth.currentUser.uid;
  const [loading, setLoading] = useState(false);

  // TEMP DEMO DATA (later comes from Firestore)
  const [bids] = useState([
    {
      id: "1",
      bidderName: "Contractor A",
      bidderId: "USER_1",
      amount: "6,50,00,000 INR",
      timeline: "5 months",
    },
    {
      id: "2",
      bidderName: "Contractor B",
      bidderId: "USER_2",
      amount: "6,80,00,000 INR",
      timeline: "6 months",
    },
  ]);

  const acceptBid = async (bid) => {
    try {
      setLoading(true);

      // 1️⃣ Create chat document
      const chatRef = await addDoc(collection(db, "chats"), {
        listingId,
        listingTitle,
        participants: [currentUserId, bid.bidderId],
        createdAt: serverTimestamp(),
        lastMessage: "",
      });

      // 2️⃣ Navigate to chat screen
      navigation.replace("ChatScreen", {
        chatId: chatRef.id,
        listingTitle,
      });
    } catch (error) {
      alert("Error creating chat");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.bidder}>{item.bidderName}</Text>
      <Text>Amount: {item.amount}</Text>
      <Text>Timeline: {item.timeline}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => acceptBid(item)}
      >
        <Text style={styles.buttonText}>Accept & Chat</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0a3d62" />
        <Text>Creating chat...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bids for "{listingTitle}"</Text>

      <FlatList
        data={bids}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f6fa",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0a3d62",
  },
  card: {
    backgroundColor: "#dff9fb",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  bidder: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#0a3d62",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
