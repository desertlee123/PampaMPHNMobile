import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const AuthHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoBox}>
        <MaterialIcons name="museum" size={48} color="white" />
      </View>
      <Text style={styles.title}>PAMPA MPHN</Text>
      <Text style={styles.subtitle}>Museo Provincial de Historia Natural</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: "center", marginBottom: 20 },
  logoBox: {
    backgroundColor: "#FFA500",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#111827" },
  subtitle: { color: "#6B7280", marginBottom: 20 },
});


export default AuthHeader;