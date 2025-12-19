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
 * Verify user is a participant before any chat action
 */
const assertParticipant = async (chatId) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  const chatSnap = await getDoc(doc(db, "chats", chatId));
  if (!chatSnap.exists()) throw new Error("Chat not found");

  const chat = chatSnap.data();
  if (!chat.participants.includes(uid)) {
    throw new Error("Not authorized for this chat");
  }

  return chat;
};

/**
 * Subscribe to messages (real-time)
 */
export const subscribeToMessages = (chatId, callback) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

/**
 * Send message (text or attachment)
 */
export const sendMessageService = async ({
  chatId,
  text = "",
  attachment = null,
}) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  await assertParticipant(chatId);

  if (!text && !attachment) {
    throw new Error("Empty message");
  }

  await addDoc(collection(db, "chats", chatId, "messages"), {
    senderId: uid,
    text,
    attachment,
    seenBy: [uid],
    createdAt: serverTimestamp(),
  });
};
