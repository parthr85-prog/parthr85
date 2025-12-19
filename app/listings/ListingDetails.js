import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ListingDetails({ route, navigation }) {
  const { listing } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{listing.title}</Text>

      <View style={styles.box}>
        <Text>Description:</Text>
        <Text>{listing.description}</Text>
      </View>

      <View style={styles.box}>
        <Text>Time Limit:</Text>
        <Text>{listing.timeLimit}</Text>
      </View>

      <View style={styles.box}>
        <Text>Value:</Text>
        <Text>₹{listing.value}</Text>
      </View>

      <Button
        title="View / Place Bids"
        onPress={() =>
          navigation.navigate("BidScreen", {
            listingId: listing.id,
            listingTitle: listing.title,
          })
        }
      />

      <View style={{ marginTop: 15 }}>
        <Button
          title="Open Project Chat"
          color="#27ae60"
          onPress={() =>
            navigation.navigate("ChatScreen", {
              listingId: listing.id,
              listingTitle: listing.title,
            })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  box: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});
