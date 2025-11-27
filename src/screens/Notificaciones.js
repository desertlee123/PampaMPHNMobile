import { View, Text, ScrollView, Pressable, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteOutlineIcon, notificationsNoneIcon, closeIcon } from "../../assets/Icons";

export default function Notificaciones() {
  const { theme } = useTheme();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar notificaciones de AsyncStorage
  const cargarNotificaciones = useCallback(async () => {
    try {
      // console.log("Cargando notificaciones desde AsyncStorage...");
      const data = await AsyncStorage.getItem('@notifications');
      const notifs = data ? JSON.parse(data) : [];
      setNotificaciones(notifs);
      // console.log("Notificaciones cargadas:", notifs.length);
    } catch (error) {
      // console.error("Error cargando notificaciones:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar el componente
  useEffect(() => {
    cargarNotificaciones();
    
    // Recargar cada 2 segundos para ver actualizaciones en tiempo real
    const interval = setInterval(cargarNotificaciones, 2000);
    
    return () => clearInterval(interval);
  }, [cargarNotificaciones]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarNotificaciones();
    setRefreshing(false);
  }, [cargarNotificaciones]);

  // Eliminar una notificación
  const eliminarNotificacion = useCallback(async (id) => {
    try {
      // console.log("Eliminando notificación:", id);
      const remaining = notificaciones.filter(n => n.id !== id);
      await AsyncStorage.setItem('@notifications', JSON.stringify(remaining));
      setNotificaciones(remaining);
      // console.log("Notificación eliminada");
    } catch (error) {
      // console.error("Error eliminando notificación:", error);
    }
  }, [notificaciones]);

  // Limpiar todas
  const limpiarTodas = useCallback(async () => {
    try {
      // console.log("Limpiando todas las notificaciones...");
      await AsyncStorage.setItem('@notifications', JSON.stringify([]));
      setNotificaciones([]);
      // console.log("Todas las notificaciones eliminadas");
    } catch (error) {
      // console.error("Error limpiando notificaciones:", error);
    }
  }, []);

  // // Función para simular recepción de notificación (testing)
  // const agregarNotificacionTest = useCallback(async () => {
  //   try {
  //     const notif = {
  //       id: Date.now().toString(),
  //       title: "Notificación de Prueba",
  //       body: "Esta es una prueba - " + new Date().toLocaleTimeString(),
  //       timestamp: new Date().toISOString(),
  //       read: false,
  //     };
      
  //     const existing = await AsyncStorage.getItem('@notifications');
  //     const notifs = existing ? JSON.parse(existing) : [];
  //     const updated = [notif, ...notifs];
      
  //     await AsyncStorage.setItem('@notifications', JSON.stringify(updated));
  //     setNotificaciones(updated);
  //     console.log("Notificación de prueba agregada");
  //   } catch (error) {
  //     console.error("Error agregando notificación de prueba:", error);
  //   }
  // }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          backgroundColor: theme.cardBackground,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.text.primary,
                marginBottom: 4,
              }}
            >
              Notificaciones ({notificaciones.length})
            </Text>
            <Text style={{ fontSize: 12, color: theme.text.secondary }}>
              {notificaciones.length} {notificaciones.length === 1 ? "notificación" : "notificaciones"}
            </Text>
          </View>
          {notificaciones.length > 0 && (
            <Pressable
              onPress={limpiarTodas}
              style={({ pressed }) => ({
                padding: 8,
                backgroundColor: pressed ? "rgba(255, 0, 0, 0.1)" : "transparent",
                borderRadius: 6,
              })}
            >
              {deleteOutlineIcon({ color: "#FF6B6B", size: 20 })}
            </Pressable>
          )}
        </View>
      </View>

      {/* <Pressable
        onPress={agregarNotificacionTest}
        style={({ pressed }) => ({
          margin: 12,
          padding: 12,
          backgroundColor: pressed ? "#FF8C00" : "#FFA500",
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        })}
      >
        <MaterialIcons name="add-circle" size={20} color="white" />
        <Text style={{ color: "white", fontWeight: "600" }}>
          Agregar de Prueba
        </Text>
      </Pressable> */}

      {notificaciones.length > 0 ? (
        <FlatList
          data={notificaciones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: theme.cardBackground,
                marginHorizontal: 12,
                marginVertical: 6,
                padding: 12,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: theme.primary,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: theme.text.primary,
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.text.secondary,
                      marginBottom: 8,
                      lineHeight: 18,
                    }}
                    numberOfLines={3}
                  >
                    {item.body}
                  </Text>
                  <Text style={{ fontSize: 10, color: theme.text.secondary }}>
                    ⏰ {new Date(item.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <Pressable
                  onPress={() => eliminarNotificacion(item.id)}
                  style={({ pressed }) => ({
                    padding: 6,
                    marginLeft: 8,
                  })}
                >
                  {closeIcon({ color: theme.text.secondary, size: 18 })}
                </Pressable>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
        >
          {notificationsNoneIcon({ color: theme.text.secondary, size: 64 })}
          <View style={{ marginBottom: 16, opacity: 0.5 }} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: theme.text.primary,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Sin notificaciones
          </Text>
        </ScrollView>
      )}
    </View>
  );
}