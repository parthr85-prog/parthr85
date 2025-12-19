import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const activateMonthlySubscription = async (userId) => {
  const expiryDate = Timestamp.fromDate(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  await updateDoc(doc(db, "users", userId), {
    subscription: {
      active: true,
      plan: "monthly",
      expiresAt: expiryDate
    }
  });
};
