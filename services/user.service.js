import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

/**
 * Creates a user document ONCE.
 * Role becomes immutable after creation (except admin).
 */
export const createUserIfNotExists = async ({
  role,
  profileData,
}) => {
  const uid = auth.currentUser?.uid;
  const phone = auth.currentUser?.phoneNumber;

  if (!uid) {
    throw new Error("User not authenticated");
  }

  const userRef = doc(db, "users", uid);
  const existingSnap = await getDoc(userRef);

  if (existingSnap.exists()) {
    throw new Error("User already registered");
  }

  if (!["company", "contractor", "labour"].includes(role)) {
    throw new Error("Invalid role");
  }

  await setDoc(userRef, {
    role,
    phone,
    ...profileData,

    // platform control flags
    verified: false,
    blocked: false,
    subscriptionActive: false,

    createdAt: serverTimestamp(),
  });
};
