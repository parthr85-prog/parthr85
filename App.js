import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* ========== AUTH SCREENS ========== */
import LoginScreen from "./app/screens/LoginScreen";
import RegisterScreen from "./app/screens/RegisterScreen";

/* ========== DASHBOARDS ========== */
import AdminDashboard from "./app/dashboards/AdminDashboard";
import CompanyDashboard from "./app/dashboards/CompanyDashboard";
import ContractorDashboard from "./app/dashboards/ContractorDashboard";
import LabourDashboard from "./app/dashboards/LabourDashboard";

/* ========== COMMON SCREENS ========== */
import BidScreen from "./app/screens/BidScreen";
import ChatList from "./app/screens/ChatList";
import ChatScreen from "./app/screens/ChatScreen";
import ListingDetails from "./app/screens/ListingDetails";
import NotificationsScreen from "./app/screens/NotificationsScreen";

/* ========== SUBSCRIPTION & VERIFICATION ========== */
import SubscriptionBlocked from "./app/screens/SubscriptionBlocked";
import SubscriptionScreen from "./app/screens/SubscriptionScreen";
import UserVerification from "./app/screens/UserVerification";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#0a3d62" },
          headerTintColor: "#fff",
        }}
      >
        {/* ===== AUTH ===== */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Create Account" }}
        />

        {/* ===== DASHBOARDS ===== */}
        <Stack.Screen
          name="CompanyDashboard"
          component={CompanyDashboard}
          options={{ title: "Company Dashboard" }}
        />

        <Stack.Screen
          name="ContractorDashboard"
          component={ContractorDashboard}
          options={{ title: "Contractor Dashboard" }}
        />

        <Stack.Screen
          name="LabourDashboard"
          component={LabourDashboard}
          options={{ title: "Labour Dashboard" }}
        />

        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ title: "Admin Panel" }}
        />

        {/* ===== LISTINGS & BIDS ===== */}
        <Stack.Screen
          name="ListingDetails"
          component={ListingDetails}
          options={{ title: "Listing Details" }}
        />

        <Stack.Screen
          name="BidScreen"
          component={BidScreen}
          options={{ title: "Bids" }}
        />

        {/* ===== CHAT ===== */}
        <Stack.Screen
          name="ChatList"
          component={ChatList}
          options={{ title: "Messages" }}
        />

        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ title: "Chat" }}
        />

        {/* ===== NOTIFICATIONS ===== */}
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ title: "Notifications" }}
        />

        {/* ===== SUBSCRIPTION & VERIFICATION ===== */}
        <Stack.Screen
          name="UserVerification"
          component={UserVerification}
          options={{ title: "Verify Profile" }}
        />

        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{ title: "Subscription" }}
        />

        <Stack.Screen
          name="SubscriptionBlocked"
          component={SubscriptionBlocked}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
