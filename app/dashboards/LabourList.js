import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";

export default function LaboursList() {
  const [labours, setLabours] = useState([]);

  useEffect(() => {
    const fetchLabours = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs
        .filter((doc) => doc.data().role === "labour")
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setLabours(users);
    };
    fetchLabours();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Labours</Text>

      <FlatList
        data={labours}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>Name: {item.name}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text>City: {item.city}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default function LabourList() {
  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "labours"),
      where("contractorId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLabours(data);
        setLoading(false);
      },
      (error) => {
        console.log("Firestore error:", error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (labours.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No labours added yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Labour Team</Text>

      <FlatList
        data={labours}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>📞 {item.phone}</Text>
            <Text>🛠 Skill: {item.skill}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
