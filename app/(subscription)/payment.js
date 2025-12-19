import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Button, Text, View } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import {
  createOrderService,
  verifyPaymentService,
} from "../../services/payment.service";

export default function Payment() {
  const { planId } = useLocalSearchParams();
  const router = useRouter();

  const payNow = async () => {
    try {
      const order = await createOrderService(planId);

      const options = {
        key: "RAZORPAY_KEY", // public key
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Buildo",
        description: "Subscription Payment",
        prefill: {
          contact: "",
          email: "",
        },
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          await verifyPaymentService({
            paymentId: data.razorpay_payment_id,
            orderId: data.razorpay_order_id,
            signature: data.razorpay_signature,
            planId,
          });

          Alert.alert("Success", "Subscription activated");
          router.replace("/(tabs)/dashboard");
        })
        .catch(() => {
          Alert.alert("Payment cancelled");
        });
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Complete payment for plan: {planId}</Text>
      <Button title="Pay with Razorpay" onPress={payNow} />
    </View>
  );
}
