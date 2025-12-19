import { useLocalSearchParams } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { db } from "../../../firebase/firebaseConfig";

export default function ViewDocuments() {
  const { listingId } = useLocalSearchParams();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "documents"),
      where("listingId", "==", listingId)
    );

    const unsub = onSnapshot(q, snap => {
      setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  return (
    <FlatList
      contentContainerStyle={{ padding: 15 }}
      data={docs}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => Linking.openURL(item.url)}
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.link}>Tap to open</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15
  },
  name: { fontWeight: "bold" },
  link: { color: "#2563eb", marginTop: 5 }
});
