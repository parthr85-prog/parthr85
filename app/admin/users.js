import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    Text,
    View,
} from "react-native";
import {
    fetchAllUsersService,
    setUserBlockedService,
    verifyUserService,
} from "../../services/admin.service";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const data = await fetchAllUsersService();
    setUsers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const verifyUser = async (user) => {
    try {
      await verifyUserService({
        userId: user.id,
        gstVerified: !!user.gst,
        aadhaarVerified: !!user.aadhaar,
      });
      Alert.alert("Verified");
      load();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const toggleBlock = async (user) => {
    try {
      await setUserBlockedService({
        userId: user.id,
        blocked: !user.blocked,
      });
      load();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <FlatList
      contentContainerStyle={{ padding: 15 }}
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View
          style={{
            borderWidth: 1,
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            {item.name || item.companyName || "User"}
          </Text>
          <Text>Role: {item.role}</Text>
          <Text>Verified: {item.verified ? "Yes" : "No"}</Text>
          <Text>Blocked: {item.blocked ? "Yes" : "No"}</Text>

          {!item.verified && (
            <Button title="Verify" onPress={() => verifyUser(item)} />
          )}

          <Button
            title={item.blocked ? "Unblock" : "Block"}
            color={item.blocked ? "green" : "red"}
            onPress={() => toggleBlock(item)}
          />
        </View>
      )}
    />
  );
}
