import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { SUBSCRIPTION_PLANS } from "../constants/subscriptionPlans";

/**
 * Activate subscription after payment success
 */
export const activateSubscriptionService = async (planId) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) throw new Error("Invalid plan");

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) throw new Error("User not found");

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000
  );

  await updateDoc(userRef, {
    subscription: {
      planId: plan.id,
      startsAt: serverTimestamp(),
      expiresAt,
    },
  });
};

/**
 * Check subscription validity (client-side helper)
 */
export const isSubscriptionActive = (user) => {
  if (!user?.subscription?.expiresAt) return false;

  const expiry =
    user.subscription.expiresAt.toDate?.() ||
    new Date(user.subscription.expiresAt);

  return new Date() < expiry;
};
