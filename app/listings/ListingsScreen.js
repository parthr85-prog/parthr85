import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { subscribeToListings } from "../../services/listing.service";

export default function ListingsScreen() {
  const [listings, setListings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsub = subscribeToListings(setListings);
    return unsub;
  }, []);

  return (
    <FlatList
      data={listings}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 15 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/listings/ListingDetails",
              params: { id: item.id },
            })
          }
          style={{
            padding: 15,
            backgroundColor: "#fff",
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
          <Text numberOfLines={2}>{item.description}</Text>
          <Text>₹ {item.valueINR}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
