import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" options={{
        tabBarIcon: ({color}) => <Ionicons name="home" color={color} size={22} />
      }} />
      <Tabs.Screen name="listings" options={{
        tabBarIcon: ({color}) => <Ionicons name="briefcase" color={color} size={22} />
      }} />
      <Tabs.Screen name="bids" options={{
        tabBarIcon: ({color}) => <Ionicons name="cash" color={color} size={22} />
      }} />
      <Tabs.Screen name="chat" options={{
        tabBarIcon: ({color}) => <Ionicons name="chatbox" color={color} size={22} />
      }} />
      <Tabs.Screen name="profile" options={{
        tabBarIcon: ({color}) => <Ionicons name="person" color={color} size={22} />
      }} />
    </Tabs>
  );
}
