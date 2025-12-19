import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens
import BidScreen from "../bids/BidScreen";
import CompanyDashboard from "../dashboards/CompanyDashboard";
import ContractorDashboard from "../dashboards/ContractorDashboard";
import LabourDashboard from "../dashboards/LabourDashboard";
import ListingDetails from "../listings/ListingDetails";
import ProfileScreen from "../profile/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs for different dashboards
function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF5722",
        tabBarInactiveTintColor: "#555",
        tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5, height: 60 },
      }}
    >
      <Tab.Screen name="Company" component={CompanyDashboard} />
      <Tab.Screen name="Contractor" component={ContractorDashboard} />
      <Tab.Screen name="Labour" component={LabourDashboard} />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DashboardTabs"
        screenOptions={{
          headerStyle: { backgroundColor: "#FF5722" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="DashboardTabs"
          component={DashboardTabs}
          options={{ title: "Buildo" }}
        />
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
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
