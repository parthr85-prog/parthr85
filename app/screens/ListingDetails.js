import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";

export default function ListingDetails({ route, navigation }) {
  const { listing } = route.params;

  const [loading, setLoading] = useState(true);
  const [canChat, setCanChat] = useState(false);

  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    checkChatPermission();
  }, []);

  const checkChatPermission = async () => {
    try {
      // 1️⃣ Listing owner can always chat
      if (listing.ownerId === currentUserId) {
        setCanChat(true);
        setLoading(false);
        return;
      }

      // 2️⃣ Check if user has placed a bid
      const q = query(
        collection(db, "bids"),
        where("listingId", "==", listing.id),
        where("bidderId", "==", currentUserId)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setCanChat(true);
      } else {
        setCanChat(false);
      }
    } catch (error) {
      console.log("Chat permission error:", error);
      setCanChat(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{listing.title}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{listing.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Time Limit</Text>
        <Text style={styles.value}>{listing.timeLimit}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Project Value</Text>
        <Text style={styles.value}>₹ {listing.value}</Text>
      </View>

      <View style={styles.buttonBox}>
        <Button
          title="View / Place Bids"
          color="#FF5722"
          onPress={() =>
            navigation.navigate("BidScreen", {
              listingId: listing.id,
              listingTitle: listing.title,
              ownerId: listing.ownerId,
            })
          }
        />
      </View>

      {canChat && (
        <View style={styles.buttonBox}>
          <Button
            title="Chat with Listing Owner"
            color="#0a3d62"
            onPress={() =>
              navigation.navigate("ChatScreen", {
                listingId: listing.id,
                otherUserId: listing.ownerId,
              })
            }
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#222",
  },
  buttonBox: {
    marginTop: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
