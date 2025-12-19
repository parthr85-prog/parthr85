import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

/**
 * Place a bid (one bid per user per listing)
 */
export const placeBidService = async ({
  listingId,
  amount,
  message,
}) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  const userSnap = await getDoc(doc(db, "users", uid));
  if (!userSnap.exists()) throw new Error("User profile missing");

  const user = userSnap.data();

  if (user.blocked) throw new Error("User is blocked");
  if (!user.subscriptionActive) {
    throw new Error("Subscription required to bid");
  }

  // prevent duplicate bid
  const existing = await getDocs(
    query(
      collection(db, "bids"),
      where("listingId", "==", listingId),
      where("bidderId", "==", uid)
    )
  );

  if (!existing.empty) {
    throw new Error("You already placed a bid");
  }

  await addDoc(collection(db, "bids"), {
