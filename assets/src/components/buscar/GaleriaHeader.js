import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { lightTheme } from "../../theme/colors";
import { useTheme } from "../../theme/ThemeContext";

export default function GaleriaHeader({ galeria, navigation }) {
  const autor = galeria?.autor ? String(galeria.autor) : "Autor desconocido";
  const titulo = galeria?.titulo ? String(galeria.titulo) : "Sin título";
  const descripcion = galeria?.descripcion ? String(galeria.descripcion) : "";

  const { theme } = useTheme();

  return (
    <View>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: theme.cardBackground,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.primary} />
        </Pressable>
      </View>

      {/* Info galería */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontFamily: theme.fonts.regular, color: theme.text.primary }}>
          {autor}
        </Text>
        <Text style={{ fontSize: 28, fontFamily: theme.fonts.bold, marginTop: 4, color: theme.text.primary }}>
          {titulo}
        </Text>
        <Text style={{ marginTop: 8, fontSize: 15, color: theme.text.primary, fontFamily: theme.fonts.regular }}>
          {descripcion}
        </Text>
        <View style={{ height: 16 }} />
      </View>
    </View>
  );
}
