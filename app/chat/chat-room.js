import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    sendMessageService,
    subscribeToMessages,
} from "../../services/chat.service";
import { uploadChatAttachment } from "../../services/chatAttachment.service";

export default function ChatRoom() {
  const { chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsub = subscribeToMessages(chatId, setMessages);
    return unsub;
  }, []);

  const sendText = async () => {
    try {
      await sendMessageService({ chatId, text });
      setText("");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const sendAttachment = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (res.canceled) return;

    try {
      const attachment = await uploadChatAttachment(
        res.assets[0],
        chatId
      );

      await sendMessageService({
        chatId,
        attachment,
      });
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            {item.text ? <Text>{item.text}</Text> : null}
            {item.attachment ? (
              <Text>📎 {item.attachment.name}</Text>
            ) : null}
          </View>
        )}
      />

      <View style={{ flexDirection: "row", padding: 10 }}>
        <TouchableOpacity onPress={sendAttachment}>
          <Text style={{ marginRight: 10 }}>📎</Text>
        </TouchableOpacity>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type message"
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 8,
            padding: 8,
          }}
        />

        <TouchableOpacity onPress={sendText}>
          <Text style={{ marginLeft: 10 }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
