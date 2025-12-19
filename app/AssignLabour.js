import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, Picker, Text, View } from "react-native";
import { db } from "../../firebase/firebaseConfig";

export default function AssignLabour() {
  const [projects, setProjects] = useState([]);
  const [labourTeams, setLabourTeams] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const projSnapshot = await getDocs(collection(db, "projects"));
      setProjects(projSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));

      const teamSnapshot = await getDocs(collection(db, "labourTeams"));
      setLabourTeams(teamSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, []);

  const assignLabour = async () => {
    if (!selectedProject || !selectedTeam) {
      Alert.alert("Error", "Select both project and team");
      return;
    }

    try {
      await updateDoc(doc(db, "projects", selectedProject), { assignedTeam: selectedTeam });
      Alert.alert("Success", "Labour team assigned");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Select Project</Text>
      <Picker selectedValue={selectedProject} onValueChange={setSelectedProject}>
        {projects.map((p) => (
          <Picker.Item key={p.id} label={p.projectName} value={p.id} />
        ))}
      </Picker>

      <Text style={{ marginTop: 20 }}>Select Labour Team</Text>
      <Picker selectedValue={selectedTeam} onValueChange={setSelectedTeam}>
        {labourTeams.map((t) => (
          <Picker.Item key={t.id} label={t.teamName} value={t.id} />
        ))}
      </Picker>

      <Button title="Assign" onPress={assignLabour} style={{ marginTop: 20 }} />
    </View>
  );
}
