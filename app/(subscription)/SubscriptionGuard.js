import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth, db } from "../../../firebase/firebaseConfig";

export default function SubscriptionGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const data = snap.data();

      if (
        !data.subscription ||
        !data.subscription.active ||
        data.subscription.expiresAt.toDate() < new Date()
      ) {
        router.replace("/subscription/SubscriptionScreen");
      }

      setChecking(false);
    };

    check();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}
