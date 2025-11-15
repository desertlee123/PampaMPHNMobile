// assets/src/screens/EscanearQR
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Pressable, Linking } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { API_BASE_URL } from "../services/api";
import { useAuth } from "../services/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function EscanearQR() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setScanned(false); // habilita escaneo cada vez que vuelvo a esta pantalla
      return () => setScanned(true);
    }, [])
  );

  // Timeout 1 minuto
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!scanned) {
        Alert.alert("Tiempo agotado", "No se pudo leer el QR a tiempo.");
        navigation.goBack();
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [scanned]);

  // Pedimos permisos al abrir
  useEffect(() => {
    if (!permission) return;
    if (!permission.granted && !permission.canAskAgain) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  const abrirConfiguracion = () => {
    Alert.alert(
      "Permiso requerido",
      "Debés habilitar la cámara desde configuración del dispositivo.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Abrir configuración", onPress: () => Linking.openSettings() }
      ]
    );
  }

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    const id = parseInt(data);
    if (isNaN(id)) {
      Alert.alert("QR inválido", "El QR no contiene un ID válido");
      navigation.goBack();
      return;
    }

    try {
      setLoadingArticle(true);
      const res = await fetch(`${API_BASE_URL}/articulos/${id}`);

      if (res.status === 404) {
        Alert.alert("No encontrado", `No existe un artículo con ID ${id}.`);
        navigation.goBack();
        return;
      }

      const articulo = await res.json();

      // Redirigir
      navigation.navigate("Articulo", { id: articulo.id });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo validar el artículo.");
      navigation.goBack();
    } finally {
      setLoadingArticle(false);
    }
  }

  // --- ESTADOS ESPECIALES ---
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFA500" />
        <Text style={{ color: theme.text.primary, marginTop: 10 }}>
          Verificando permisos...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: theme.text.primary, marginBottom: 12 }}>
          No diste permiso para usar la cámara
        </Text>

        <Pressable
          onPress={requestPermission}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Intentar de nuevo</Text>
        </Pressable>

        <Pressable
          onPress={abrirConfiguracion}
          style={[styles.button, { backgroundColor: "#444" }]}
        >
          <Text style={styles.buttonText}>Abrir configuración</Text>
        </Pressable>
      </View>
    );
  }

  // --- CÁMARA ---
  return (
    <View style={{ flex: 1 }}>
      {loadingArticle && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "white", marginBottom: 10 }}>
            Validando artículo...
          </Text>
        </View>
      )}

      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View style={styles.overlayBottom}>
        <Text style={{ color: "white", fontSize: 18 }}>
          Apuntá al código QR
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  overlayBottom: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    zIndex: 9,
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
