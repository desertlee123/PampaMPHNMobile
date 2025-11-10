import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_BASE_URL } from "../services/api";
import { lightTheme } from "../theme/colors";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  Image
} from "react-native";
import Box from "../components/Box";
import GaleriaHeader from "../components/buscar/GaleriaHeader";

export default function GaleriaAutor() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [galeria, setGaleria] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${API_BASE_URL.replace("/api", "")}/${cleanPath}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const galRes = await fetch(`${API_BASE_URL}/galerias/${id}`);
        const galData = await galRes.json();
        setGaleria(galData);

        const artRes = await fetch(`${API_BASE_URL}/articulos/galeria/${id}`);
        const artData = await artRes.json();
        setArticulos(
          Array.isArray(artData)
            ? artData.map((a) => ({ ...a, imagen: normalizeImage(a.imagen) }))
            : []
        );
      } catch (err) {
        console.error("Error cargando galería:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
      </View>
    );
  }

  if (!galeria) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No se encontró la galería.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: lightTheme.background }}>
      <FlatList
        data={articulos}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <GaleriaHeader galeria={galeria} navigation={navigation} />
        )}
        columnWrapperStyle={{ paddingHorizontal: 10 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <Box
            title={item.titulo}
            imageUrl={item.imagen}
            // acá aplicamos el estilo para que tome la mitad del ancho y el margen
            style={{
              flex: 1,
              margin: 6,
              width: 'auto'
            }}
          // Nota: Si los artículos tuvieran su propia ruta de navegación, se pasaría aquí.
          />
        )}
      />
    </View>
  );
}
