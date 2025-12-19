import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getOrCreateChat = async (userA, userB) => {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", userA)
  );

  const snapshot = await getDocs(q);

  for (let d of snapshot.docs) {
    if (d.data().participants.includes(userB)) {
      return d.id;
    }
  }

  const chatRef = await addDoc(collection(db, "chats"), {
    participants: [userA, userB],
    lastMessage: "",
    updatedAt: serverTimestamp()
  });

  return chatRef.id;
};
