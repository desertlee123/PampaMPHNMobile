import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { lightTheme } from "../theme/colors";
import { useAuth } from "../services/AuthContext";
import { getSession, saveSession } from "../services/storage";
import { API_BASE_URL } from "../services/api";

export default function Suscripcion({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const MP_URL = "https://mpago.la/2BkJCW8";

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      Linking.openURL(MP_URL);
      const session = await getSession();

      const res = await fetch(`${API_BASE_URL}/user/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ role: "partner" }),
      });

      if (!res.ok) throw new Error("Error actualizando rol");

      const data = await res.json();
      const updated = { ...session, role: data.user.role };
      await saveSession(updated);
      setSession(updated);

      Alert.alert("Socio confirmado", "Tu membresía se activó exitosamente.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Error", "No se pudo completar la suscripción.");
    } finally {
      setLoading(false);
    }
  };

  const planLabel =
    selectedPlan === "annual"
      ? "Suscribirse por $5.000 por mes"
      : "Suscribirse por $7.000 por mes";

  return (
    <View style={styles.container}>
      {/* Ícono superior */}
      <View style={styles.iconWrapper}>
        <Ionicons name="star" size={96} color="#fff" />
      </View>

      <Text style={styles.title}>Conviértete en Socio</Text>
      <Text style={styles.subtitle}>
        Obtené beneficios como eventos y contenido exclusivo tanto en la App
        como en nuestro museo
      </Text>

      {/* Planes */}
      <View style={styles.planContainer}>
        <Pressable
          style={[
            styles.planCard,
            selectedPlan === "annual" && styles.selectedCard,
          ]}
          onPress={() => setSelectedPlan("annual")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={
                selectedPlan === "annual"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={22}
              color={lightTheme.primary}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.planTitle}>Anual</Text>
              <Text style={styles.planSubtitle}>$60.000/año</Text>
            </View>
          </View>
          <Text style={styles.planPrice}>$5.000/mes</Text>
        </Pressable>

        <Pressable
          style={[
            styles.planCard,
            selectedPlan === "monthly" && styles.selectedCard,
          ]}
          onPress={() => setSelectedPlan("monthly")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={
                selectedPlan === "monthly"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={22}
              color={lightTheme.primary}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.planTitle}>Mensual</Text>
            </View>
          </View>
          <Text style={styles.planPrice}>$7.000/mes</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.subscribeButton, loading && { opacity: 0.6 }]}
        onPress={handleSubscribe}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.subscribeText}>{planLabel}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.background,
    padding: 20,
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: lightTheme.primary,
    width: 160,
    height: 160,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: lightTheme.fonts.bold,
    color: lightTheme.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: lightTheme.text.secondary,
    marginBottom: 24,
  },
  planContainer: {
    width: "100%",
    gap: 16,
  },
  planCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCard: {
    borderColor: lightTheme.primary,
    backgroundColor: "#FFF7E6",
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: lightTheme.text.primary,
  },
  planSubtitle: {
    color: lightTheme.text.secondary,
    fontSize: 13,
  },
  planPrice: {
    fontWeight: "bold",
    color: lightTheme.text.primary,
  },
  subscribeButton: {
    marginTop: "auto",
    backgroundColor: lightTheme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
  },
  subscribeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
