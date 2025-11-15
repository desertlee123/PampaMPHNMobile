// assets/src/screens/GaleriaAutor.js
import { useEffect, useState } from "react";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { API_BASE_URL } from "../services/api";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList
} from "react-native";
import Box from "../components/Box";
import GaleriaHeader from "../components/buscar/GaleriaHeader";
import { useTheme } from "../theme/ThemeContext";
import { useAuth } from "../services/AuthContext";

export default function GaleriaAutor() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [galeria, setGaleria] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();

  const { session } = useAuth();
  const isFocussed = useIsFocused();

  const normalizeImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${API_BASE_URL.replace("/api", "/img")}/${cleanPath}`;
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
  }, [id, session, isFocussed]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.primary} />
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
    <View style={{ flex: 1, backgroundColor: theme.background }}>
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
            paraSocios={item.para_socios}
            esSocio={session?.role === "partner"}
            onPress={() => navigation.getParent().navigate("Articulo", { id: item.id })}
            // acá aplicamos el estilo para que tome la mitad del ancho y el margen
            style={{
              flex: 1,
              margin: 6,
              width: 'auto'
            }}
          />
        )}
      />
    </View>
  );
}
