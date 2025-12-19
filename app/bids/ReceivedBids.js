import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { db } from "../../../firebase/firebaseConfig";

export default function ReceivedBids() {
  const { listingId } = useLocalSearchParams();
  const [bids, setBids] = useState([]);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const q = query(
        collection(db, "bids"),
        where("listingId", "==", listingId)
      );
      const snapshot = await getDocs(q);
      const bidList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBids(bidList);
    } catch (error) {
      console.log("Error fetching bids:", error);
    }
  };

  const renderBid = ({ item }) => (
    <View style={styles.bidCard}>
      <Text style={styles.amount}>₹ {item.amount}</Text>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Received Bids</Text>
      <FlatList
        data={bids}
        keyExtractor={(item) => item.id}
        renderItem={renderBid}
        ListEmptyComponent={<Text>No bids received yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  bidCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  amount: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
});
