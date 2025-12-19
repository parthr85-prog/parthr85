import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { auth } from "../../../firebase/firebaseConfig";
import { getOrCreateChat } from "../../firebase/chatUtils";

export default function StartChatButton({ otherUserId }) {
  const router = useRouter();

  const startChat = async () => {
    const chatId = await getOrCreateChat(
      auth.currentUser.uid,
      otherUserId
    );

    router.push(`/chat/ChatScreen?chatId=${chatId}`);
  };

  return (
    <TouchableOpacity
      onPress={startChat}
      style={{
        backgroundColor: "#16a34a",
        padding: 10,
        borderRadius: 10
      }}
    >
      <Text style={{ color: "#fff" }}>Chat</Text>
    </TouchableOpacity>
  );
}
