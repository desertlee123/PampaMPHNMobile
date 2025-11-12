import { useState, useEffect, use } from "react";
import { View, Text, Pressable, ActivityIndicator, ScrollView, FlatList } from "react-native";
import { getSession } from "../services/storage";
import { logoutUser } from "../services/authService";
import { useAuth } from "../services/AuthContext"; // Importamos el hook
import { useNavigation } from "@react-navigation/native";
import Seccion from "../components/Seccion";
import { lightTheme } from '../theme/colors';
import Carrusel from "../components/carrusel/Carrusel";
import Box from "../components/Box";
import { ArticulosData } from "../../datos de prueba/ArticulosData";
import { useTheme } from "../theme/ThemeContext";
import { getAllArticulos, getLastArticulos, getAllCategorias } from "../services/api";

export default function Home() {
  // const [session, setSessionInternal] = useState(null); // Estado interno para la sesión
  // const [loading, setLoading] = useState(null);

  // const { setSession } = useAuth(); // Usamos el hook para el setter global (solo para Logout)

  const navigator = useNavigation();

  const { session, setSession } = useAuth();
  const [dataElements, setDataElements] = useState(
    {
      loading: true,
      articulos: [],
      articulosRecientes: [],
      categorias: [],
    }
  );
  
  /* useEffect(() => {
    const loadSession = async () => {
      const stored = await getSession(); // Lee del storage, SIN props
      setSessionInternal(stored);
      setLoading(false);
    };
    loadSession();
  }, []); */

  useEffect(() => {
    cargarElementos().then((data) => {
      const {
        articulos,
        articulosRecientes,
        categorias,
      } = data;
      
      setDataElements(
        {
          loading: false,
          articulos,
          articulosRecientes,
          categorias,
        }
      );
    }).catch((error) => {
      console.log("Error al cargar los artículos: ", error);
    });
  }, []);

  const { theme } = useTheme();

  if (dataElements.loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Sesión no válida. Iniciá sesión nuevamente.</Text>
        <Pressable onPress={() => setSession(null)}>
          <Text style={{ color: "orange", marginTop: 10 }}>Volver al login</Text>
        </Pressable>
      </View>
    );
  }

  const role = session.role;

  console.log("ROL ACTUAL: ", role);


  return (
    <FlatList style={{ flex: 1, padding: 16, backgroundColor: theme.background }}
      ListHeaderComponent={
      <>
        <Seccion title="Categorias">
          <Carrusel data={dataElements.categorias}/>
        </Seccion>
        <Seccion title="Novedades"></Seccion>
        <FlatList
          data={dataElements.articulosRecientes}
          renderItem={({ item }) => <Box title={item.titulo} imageUrl={item.imageUrl} paraSocios={item.para_socios} onPress={() => navigator.navigate("Articulo")}/>}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        />
        {/* <Seccion title="Mas Populares"></Seccion>
        <FlatList
          data={ArticulosData}
          renderItem={({ item }) => <Box title={item.title} imageUrl={item.imageUrl} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        /> */}
        <Seccion title="Articulos"></Seccion>
      </>
      }
      data={dataElements.articulos}
      renderItem={({ item }) => <Box title={item.titulo} imageUrl={item.imageUrl} paraSocios={item.para_socios} onPress={() => navigator.navigate("Articulo")}/>}  
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 16 }}
      numColumns={2}
    />
  );
}

async function cargarElementos() {
  const articulos = await getAllArticulos();
  const articulosRecientes = await getLastArticulos();
  const categorias = await getAllCategorias();

  return {
    articulos,
    articulosRecientes,
    categorias,
  };
}