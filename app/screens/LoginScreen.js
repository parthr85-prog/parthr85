import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerForPushNotifications = async (uid) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;

    await updateDoc(doc(db, "users", uid), {
      expoPushToken: token,
    });
  };

  const login = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await registerForPushNotifications(userCred.user.uid);

      const snap = await getDoc(doc(db, "users", userCred.user.uid));
      const role = snap.data().role;

      if (role === "company") navigation.replace("CompanyDashboard");
      if (role === "contractor") navigation.replace("ContractorDashboard");
      if (role === "labour") navigation.replace("LabourDashboard");
      if (role === "admin") navigation.replace("AdminDashboard");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={login} />

      <View style={{ marginTop: 10 }}>
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
