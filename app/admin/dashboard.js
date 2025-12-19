import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { fetchAllUsersService } from "../../services/admin.service";

export default function AdminDashboard() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchAllUsersService().then((users) => setCount(users.length));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Admin Dashboard
      </Text>
      <Text>Total Users: {count}</Text>
    </View>
  );
}
