import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { lightTheme } from "../theme/colors";

const AuthHeader = () => {
  const theme = lightTheme;
  const currenStyles = styles(theme);

  return (
    <View style={currenStyles.header}>
      <View style={currenStyles.logoBox}>
        <MaterialIcons name="museum" size={48} color="white" />
      </View>
      <Text style={currenStyles.title}>PAMPA MPHN</Text>
      <Text style={currenStyles.subtitle}>Museo Provincial de Historia Natural</Text>
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
  header: { alignItems: "center", marginBottom: 20 },
  logoBox: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    // fontWeight: "bold",
    fontFamily: theme.fonts.bold,
    color: theme.text.primary
  },
  subtitle: {
    color: theme.text.secondary,
    fontFamily: theme.fonts.regular,
    marginBottom: 20
  },
});


export default AuthHeader;