// assets/src/screens/ArticuloAutorProvisorio.js
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";

export default function ArticuloAutorProvisorio() {
  const { theme } = useTheme();
  const route = useRoute();
  const { idArticulo } = route.params || {};

  console.log("En pantalla artículo:", idArticulo);

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background
    }}>
      <Text style={{
        fontSize: 26,
        color: theme.text.primary,
        fontWeight: "bold"
      }}>
        Artículo provisorio
      </Text>
    </View>
  );
}
