import {
    collection,
    doc,
    getDocs,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

/**
 * Ensure current user is admin
 */
const assertAdmin = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  const adminSnap = await getDoc(doc(db, "users", uid));
  if (!adminSnap.exists() || adminSnap.data().role !== "admin") {
    throw new Error("Admin access only");
  }

  return uid;
};

/**
 * Fetch all users (admin only)
 */
export const fetchAllUsersService = async () => {
  await assertAdmin();
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Verify GST / Aadhaar
 */
export const verifyUserService = async ({
  userId,
  gstVerified = false,
  aadhaarVerified = false,
}) => {
  const adminUid = await assertAdmin();

  await updateDoc(doc(db, "users", userId), {
    verified: true,
    verification: {
      gstVerified,
      aadhaarVerified,
      verifiedBy: adminUid,
      verifiedAt: serverTimestamp(),
    },
  });
};

/**
 * Block or unblock user
 */
export const setUserBlockedService = async ({
  userId,
  blocked,
}) => {
  await assertAdmin();

  await updateDoc(doc(db, "users", userId), {
    blocked,
  });
};
