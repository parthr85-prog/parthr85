import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { placeBidService } from "../../services/bid.service";

export default function PlaceBid() {
  const { listingId } = useLocalSearchParams();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!amount || !message) {
      Alert.alert("Error", "All fields required");
      return;
    }

    try {
      await placeBidService({
        listingId,
        amount: Number(amount),
        message,
      });

      Alert.alert("Success", "Bid placed");
      router.back();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Bid Amount (₹)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Button title="Place Bid" onPress={submit} />
    </View>
  );
}
