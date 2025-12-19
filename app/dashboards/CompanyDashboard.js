import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const CompanyDashboard = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      // 🔹 TEMP STATIC PROJECTS (later from Firebase)
      const listings = [
        {
          id: "1",
          title: "Bridge Construction",
          description: "River bridge construction project",
          timeLimit: "6 months",
          value: "7,00,00,000",
        },
        {
          id: "2",
          title: "Road Expansion",
          description: "Expand highway to 6 lanes",
          timeLimit: "4 months",
          value: "5,00,00,000",
        },
      ];

      const updatedProjects = [];

      for (let listing of listings) {
        let assignedContractor = null;

        const bidsRef = collection(db, "bids", listing.id, "items");
        const snapshot = await getDocs(bidsRef);

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.status === "ASSIGNED") {
            assignedContractor = data.bidderName;
          }
        });

        updatedProjects.push({
          ...listing,
          assignedContractor,
        });
      }

      setProjects(updatedProjects);
    } catch (error) {
      console.log("Dashboard load error", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ListingDetails", { listing: item })
      }
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.info}>Time: {item.timeLimit}</Text>
      <Text style={styles.info}>Value: ₹{item.value}</Text>

      {item.assignedContractor ? (
        <View style={styles.assignedBox}>
          <Text style={styles.assignedText}>
            ✔ Assigned to: {item.assignedContractor}
          </Text>
        </View>
      ) : (
        <View style={styles.openBox}>
          <Text style={styles.openText}>🟢 OPEN FOR BIDDING</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0a3d62" />
        <Text>Loading projects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Company Projects</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0a3d62",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#dff9fb",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#130f40",
  },
  desc: {
    fontSize: 14,
    color: "#130f40",
    marginVertical: 5,
  },
  info: {
    fontSize: 14,
    color: "#130f40",
  },
  assignedBox: {
    marginTop: 10,
    backgroundColor: "#27ae60",
    padding: 6,
    borderRadius: 6,
  },
  assignedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  openBox: {
    marginTop: 10,
    backgroundColor: "#f1c40f",
    padding: 6,
    borderRadius: 6,
  },
  openText: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CompanyDashboard;
