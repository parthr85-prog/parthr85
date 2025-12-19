import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LabourDashboard = ({ navigation }) => {
  const [jobs, setJobs] = useState([
    {
      id: "1",
      title: "Road Work",
      description: "Highway resurfacing project",
      timeLimit: "3 months",
      value: "2,00,00,000 INR",
    },
    {
      id: "2",
      title: "Bridge Maintenance",
      description: "Repair and maintenance of river bridge",
      timeLimit: "2 months",
      value: "1,50,00,000 INR",
    },
  ]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ListingDetails", { listing: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.info}>Time: {item.timeLimit}</Text>
      <Text style={styles.info}>Value: {item.value}</Text>
      <Text style={styles.button}>View Details</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Labour Jobs</Text>

      {/* Profile Shortcut */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("LabourProfile")}
      >
        <Text style={styles.profileButtonText}>Go to Profile</Text>
      </TouchableOpacity>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa", padding: 10 },
  header: { fontSize: 22, fontWeight: "bold", color: "#f0932b", marginBottom: 10 },
  profileButton: {
    backgroundColor: "#f9ca24",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  profileButtonText: { color: "#130f40", fontWeight: "bold" },
  card: {
    backgroundColor: "#dff9fb",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#130f40" },
  desc: { fontSize: 14, color: "#130f40", marginVertical: 5 },
  info: { fontSize: 14, color: "#130f40" },
  button: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#f0932b",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: "bold",
  },
});

export default LabourDashboard;

