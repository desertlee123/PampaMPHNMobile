import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { lightTheme } from "../../theme/colors";

export default function GaleriaHeader({ galeria, navigation }) {
  const autor = galeria?.autor ? String(galeria.autor) : "Autor desconocido";
  const titulo = galeria?.titulo ? String(galeria.titulo) : "Sin título";
  const descripcion = galeria?.descripcion ? String(galeria.descripcion) : "";

  return (
    <View>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: lightTheme.cardBackground,
          borderBottomWidth: 1,
          borderBottomColor: lightTheme.border,
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={lightTheme.primary} />
        </Pressable>
      </View>

      {/* Info galería */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontFamily: lightTheme.fonts.regular, color: lightTheme.text.primary }}>
          {autor}
        </Text>
        <Text style={{ fontSize: 28, fontFamily: lightTheme.fonts.bold, marginTop: 4, color: lightTheme.text.primary }}>
          {titulo}
        </Text>
        <Text style={{ marginTop: 8, fontSize: 15, color: lightTheme.text.primary, fontFamily: lightTheme.fonts.regular }}>
          {descripcion}
        </Text>
        <View style={{ height: 16 }} />
      </View>
    </View>
  );
}
