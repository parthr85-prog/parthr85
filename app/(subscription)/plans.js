import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SUBSCRIPTION_PLANS } from "../../constants/subscriptionPlans";

export default function Plans() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
        <View
          key={plan.id}
          style={{
            borderWidth: 1,
            padding: 15,
            borderRadius: 12,
            marginBottom: 15,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {plan.name}
          </Text>
          <Text>₹ {plan.priceINR}</Text>
          <Text>{plan.durationDays} days</Text>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(subscription)/payment",
                params: { planId: plan.id },
              })
            }
          >
            <Text style={{ marginTop: 10, color: "blue" }}>
              Choose Plan
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
