import { auth } from "../../firebase/firebaseConfig";
import { uploadFile } from "../firebase/storageService";

/**
 * Upload chat attachment securely
 */
export const uploadChatAttachment = async (file, chatId) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  const path = `chat/${chatId}/${uid}/${Date.now()}_${file.name}`;

  const url = await uploadFile(file.uri, path);

  return {
    name: file.name,
    url,
    type: file.mimeType || "file",
  };
};
