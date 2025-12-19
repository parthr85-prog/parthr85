import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { db } from "../../../firebase/firebaseConfig";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(list);
    };
    fetchProjects();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Projects</Text>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>Project: {item.projectName}</Text>
            <Text>Contractor: {item.contractor}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}
