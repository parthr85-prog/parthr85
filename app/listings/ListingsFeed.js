import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { subscribeToListings } from "../../services/listing.service";

export default function ListingsFeed() {
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
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/listings/ListingDetails",
              params: { id: item.id },
            })
          }
          style={{ padding: 15, borderBottomWidth: 1 }}
        >
          <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
          <Text>₹ {item.valueINR}</Text>
          <Text>⏳ {item.timeLimitDays} days</Text>
        </TouchableOpacity>
      )}
    />
  );
}
