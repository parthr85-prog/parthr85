import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const LOGGED_IN_CONTRACTOR = "Contractor A"; // 🔴 later replace with auth user

const ContractorDashboard = () => {
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAssignedProjects = async () => {
    try {
      const projects = [];

      // 🔹 TEMP STATIC PROJECTS (same IDs as company dashboard)
      const listings = [
        { id: "1", title: "Bridge Construction" },
        { id: "2", title: "Road Expansion" },
      ];

      for (let listing of listings) {
        const bidsRef = collection(db, "bids", listing.id, "items");
        const snapshot = await getDocs(bidsRef);

        snapshot.forEach((docSnap) => {
          const bid = docSnap.data();

          if (
            bid.status === "ASSIGNED" &&
            bid.bidderName === LOGGED_IN_CONTRACTOR
          ) {
            projects.push({
              listingId: listing.id,
              title: listing.title,
              amount: bid.bidAmount,
              timeline: bid.timeline,
            });
          }
        });
      }

      setAssignedProjects(projects);
    } catch (error) {
      console.log("Contractor dashboard error", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadAssignedProjects();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0a3d62" />
        <Text>Loading assigned projects...</Text>
      </View>
    );
  }

  if (assignedProjects.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No projects assigned yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Assigned Projects</Text>

      <FlatList
        data={assignedProjects}
        keyExtractor={(item) => item.listingId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.info}>Bid Amount: ₹{item.amount}</Text>
            <Text style={styles.info}>Timeline: {item.timeline}</Text>

            <View style={styles.assignedBox}>
              <Text style={styles.assignedText}>
                ✔ Project Assigned
              </Text>
            </View>
          </View>
        )}
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
    borderRadius: 12,
    marginBottom: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#130f40",
  },
  info: {
    fontSize: 14,
    color: "#130f40",
    marginTop: 5,
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
  },
});

export default ContractorDashboard;
