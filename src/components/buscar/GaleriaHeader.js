import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { lightTheme } from "../../theme/colors";
import { useTheme } from "../../theme/ThemeContext";
import Header from "../Header";
import Info from "../Info";

export default function GaleriaHeader({ galeria, navigation }) {
  const autor = galeria?.autor ? String(galeria.autor) : "Autor desconocido";
  const titulo = galeria?.titulo ? String(galeria.titulo) : "Sin título";
  const descripcion = galeria?.descripcion ? String(galeria.descripcion) : "";

  const { theme } = useTheme();

  return (
    <View>
      {/* Header */}
      <Header navigation={navigation} theme={theme}/>

      {/* Info galería */}
      <Info autor={autor} titulo={titulo} descripcion={descripcion} theme={theme} />
    </View>
  );
}
