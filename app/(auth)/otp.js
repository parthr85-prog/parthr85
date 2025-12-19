import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { useLocalSearchParams, useRouter } from "expo-router";
import { signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../../firebase/firebaseConfig";

export default function Otp() {
  const { phone } = useLocalSearchParams();
  const router = useRouter();
  const recaptchaVerifier = useRef(null);

  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    sendOtp();
  }, []);

  const sendOtp = async () => {
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaVerifier.current
      );
      setConfirm(confirmation);
    } catch (e) {
      Alert.alert("OTP Error", e.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await confirm.confirm(code);
      const uid = res.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        router.replace("/(auth)/register-role");
      } else {
        router.replace("/(tabs)/dashboard");
      }
    } catch {
      Alert.alert("Invalid OTP");
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />

      <Text style={styles.title}>Enter OTP</Text>

      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, borderRadius: 10, marginBottom: 20 },
  button: { backgroundColor: "#16a34a", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});
