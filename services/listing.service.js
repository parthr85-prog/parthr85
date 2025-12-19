import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

/**
 * Create listing with full backend-safe validation
 */
export const createListingService = async ({
  title,
  description,
  timeLimitDays,
  valueINR,
  type,
  documents,
}) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  const userSnap = await getDoc(doc(db, "users", uid));
  if (!userSnap.exists()) throw new Error("User profile not found");

  const user = userSnap.data();

  if (user.blocked) {
    throw new Error("User is blocked");
  }

  if (!user.subscriptionActive) {
    throw new Error("Active subscription required");
  }

  if (!["company", "contractor", "labour"].includes(user.role)) {
    throw new Error("Invalid role for listing creation");
  }

  await addDoc(collection(db, "listings"), {
    title,
    description,
    timeLimitDays,
    valueINR,
    type,

    ownerId: uid,
    ownerRole: user.role,

    documents: documents || [],
    status: "open",

    createdAt: serverTimestamp(),
  });
};

/**
 * Real-time listings feed (secured by Firestore rules)
 */
export const subscribeToListings = (callback) => {
  const q = query(
    collection(db, "listings"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
