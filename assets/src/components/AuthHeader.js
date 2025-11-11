import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { lightTheme } from '../theme/colors';

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
    backgroundColor: lightTheme.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    // fontWeight: "bold",
    fontFamily: lightTheme.fonts.bold,
    color: lightTheme.text.primary
  },
  subtitle: {
    color: lightTheme.text.secondary,
    fontFamily: lightTheme.fonts.regular,
    marginBottom: 20
  },
});


export default AuthHeader;