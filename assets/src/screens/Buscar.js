import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Box from "../components/Box";
import Seccion from "../components/Seccion";
import { API_BASE_URL } from "../services/api";
import { lightTheme } from "../theme/colors";

export default function Buscar() {
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // 'YYYY-MM-DD' or null
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [articulos, setArticulos] = useState([]);
  const [galerias, setGalerias] = useState([]);
  const [error, setError] = useState(null);

  const normalizeImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${API_BASE_URL.replace("/api", "")}/${cleanPath}`;
  };

  // evita problemas con timezone: construimos yyyy-mm-dd manualmente
  const isoFromDate = (dateObj) => {
    if (!dateObj) return null;
    const y = dateObj.getFullYear();
    const m = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const d = dateObj.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // fetch seguro que devuelve array o []
  const fetchJSONSafe = async (url) => {
    try {
      const res = await fetch(url);
      if (res.status === 404) return [];
      const data = await res.json();
      // si la API devuelve {message: 'No se encontraron resultados'} tratamos como []
      if (data && data.message && Array.isArray(data) === false) return [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn("fetchJSONSafe error", err, url);
      return [];
    }
  };

  // Construye query string con opcionales
  const buildQuery = (params) => {
    const parts = [];
    for (const k in params) {
      if (params[k] != null && params[k] !== "") {
        parts.push(`${k}=${encodeURIComponent(params[k])}`);
      }
    }
    return parts.length ? `?${parts.join("&")}` : "";
  };

  const handleSearch = async () => {
    const text = (searchText || "").trim();
    if (!text && !selectedDate) return; // nada para buscar

    setLoading(true);
    setError(null);

    try {
      // --- ARTÍCULOS ---
      // Queremos buscar por título OR autor OR categoría.
      // Llamamos al endpoint 3 veces con cada parámetro en separado y luego unimos resultados.
      const fechaParam = selectedDate ? selectedDate : null;

      const articleQueries = [
        { titulo: text, fecha: fechaParam },
        { autor: text, fecha: fechaParam },
        { categoria: text, fecha: fechaParam },
      ];

      const articlePromises = articleQueries.map((q) =>
        fetchJSONSafe(`${API_BASE_URL}/articulos/buscar${buildQuery(q)}`)
      );

      const articleResultsArrays = await Promise.all(articlePromises);
      // combinamos sin duplicados por id
      const articlesMap = new Map();
      articleResultsArrays.flat().forEach((a) => {
        if (!articlesMap.has(a.id)) {
          articlesMap.set(a.id, { ...a, imagen: normalizeImage(a.imagen) });
        }
      });
      const normalizedArticulos = Array.from(articlesMap.values());

      // --- GALERÍAS ---
      // Para galerías hacemos sólo titulo y autor (categoria no aplica)
      const galleryQueries = [
        { titulo: text, fecha: fechaParam },
        { autor: text, fecha: fechaParam },
      ];
      const galleryPromises = galleryQueries.map((q) =>
        fetchJSONSafe(`${API_BASE_URL}/galerias/buscar${buildQuery(q)}`)
      );
      const galleryResultsArrays = await Promise.all(galleryPromises);
      // combinar galería basico (id,titulo...) sin duplicados
      const galMap = new Map();
      galleryResultsArrays.flat().forEach((g) => {
        if (!galMap.has(g.id)) galMap.set(g.id, g);
      });
      let galList = Array.from(galMap.values());

      // Para cada galería pedimos /galerias/{id} para tomar la imagen del primer artículo
      if (galList.length) {
        const galDetailPromises = galList.map(async (g) => {
          try {
            const res = await fetch(`${API_BASE_URL}/galerias/${g.id}`);
            if (!res.ok) return { ...g, imagen: null };
            const data = await res.json();
            const img = data?.articulos?.[0]?.imagen ?? null;
            return { ...g, imagen: normalizeImage(img) };
          } catch (err) {
            return { ...g, imagen: null };
          }
        });
        galList = await Promise.all(galDetailPromises);
      }

      setArticulos(normalizedArticulos);
      setGalerias(galList);

      // Si todo vacío => mensaje
      if (normalizedArticulos.length === 0 && galList.length === 0) {
        setError("No se encontraron resultados.");
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // handler del datepicker
  const handleDateChange = (event, date) => {
    // android: si canceló, event.type === 'dismissed' (en algunos versiones)
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (!date) return; // canceló
    }

    if (!date) return;

    const iso = isoFromDate(date); // evita toISOString y shift
    setSelectedDate(iso);
  };

  const clearDate = () => {
    setSelectedDate(null);
    setShowDatePicker(false);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: lightTheme.background,
        padding: 16,
      }}
    >
      {/* Campo de búsqueda + icono */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: lightTheme.input.border,
          backgroundColor: lightTheme.input.background,
          borderRadius: 10,
          paddingHorizontal: 10,
          marginBottom: 12,
        }}
      >
        <Ionicons
          name="search"
          size={22}
          color={lightTheme.text.secondary}
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Buscar por título, autor o categoría..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          style={{
            flex: 1,
            fontSize: 16,
            color: lightTheme.text.primary,
            paddingVertical: 10,
          }}
        />
      </View>

      {/* Selector de fecha + clear */}
      <View style={{ marginBottom: 16, flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={{
            flex: 1,
            backgroundColor: "#f1f1f1",
            padding: 10,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={lightTheme.text.secondary}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: lightTheme.text.primary, fontSize: 16 }}>
            {selectedDate ? `Fecha: ${selectedDate}` : "Seleccionar fecha (opcional)"}
          </Text>
        </Pressable>

        {selectedDate ? (
          <Pressable
            onPress={clearDate}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: lightTheme.input.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="close" size={20} color="#666" />
          </Pressable>
        ) : null}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate ? new Date(selectedDate) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Botón buscar */}
      <Pressable
        onPress={handleSearch}
        style={{
          backgroundColor: lightTheme.primary,
          padding: 12,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Buscar</Text>
      </Pressable>

      {loading && <ActivityIndicator size="large" color={lightTheme.primary} />}

      {error && (
        <Text
          style={{
            textAlign: "center",
            color: "red",
            marginVertical: 12,
            fontSize: 16,
          }}
        >
          {error}
        </Text>
      )}

      {!loading && !error && (galerias.length > 0 || articulos.length > 0) && (
        <>
          {galerias.length > 0 && (
            <Seccion title="Galerías encontradas">
              <FlatList
                data={galerias}
                horizontal
                renderItem={({ item }) => <Box title={item.titulo} imageUrl={item.imagen} />}
                keyExtractor={(item) => `gal-${item.id}`}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
              />
            </Seccion>
          )}

          {articulos.length > 0 && (
            <Seccion title="Artículos encontrados">
              <FlatList
                data={articulos}
                horizontal
                renderItem={({ item }) => <Box title={item.titulo} imageUrl={item.imagen} />}
                keyExtractor={(item) => `art-${item.id}`}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
              />
            </Seccion>
          )}
        </>
      )}
    </ScrollView>
  );
}
