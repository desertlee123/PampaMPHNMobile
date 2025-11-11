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
import { useTheme } from "../theme/ThemeContext";

export default function Suscripcion({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const { theme } = useTheme();
  const currenStyles = styles(theme);
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
    <View style={currenStyles.container}>
      {/* Ícono superior */}
      <View style={currenStyles.iconWrapper}>
        <Ionicons name="star" size={96} color="#fff" />
      </View>

      <Text style={currenStyles.title}>Conviértete en Socio</Text>
      <Text style={currenStyles.subtitle}>
        Obtené beneficios como eventos y contenido exclusivo tanto en la App
        como en nuestro museo
      </Text>

      {/* Planes */}
      <View style={currenStyles.planContainer}>
        <Pressable
          style={[
            currenStyles.planCard,
            selectedPlan === "annual" && currenStyles.selectedCard,
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
              color={theme.primary}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={currenStyles.planTitle}>Anual</Text>
              <Text style={currenStyles.planSubtitle}>$60.000/año</Text>
            </View>
          </View>
          <Text style={currenStyles.planPrice}>$5.000/mes</Text>
        </Pressable>

        <Pressable
          style={[
            currenStyles.planCard,
            selectedPlan === "monthly" && currenStyles.selectedCard,
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
              color={theme.primary}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={currenStyles.planTitle}>Mensual</Text>
            </View>
          </View>
          <Text style={currenStyles.planPrice}>$7.000/mes</Text>
        </Pressable>
      </View>

      <Pressable
        style={[currenStyles.subscribeButton, loading && { opacity: 0.6 }]}
        onPress={handleSubscribe}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={currenStyles.subscribeText}>{planLabel}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: theme.primary,
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
    fontFamily: theme.fonts.bold,
    color: theme.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: theme.text.secondary,
    marginBottom: 24,
  },
  planContainer: {
    width: "100%",
    gap: 16,
  },
  planCard: {
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCard: {
    borderColor: theme.primary,
    backgroundColor: theme.highlightBackground,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.text.primary,
  },
  planSubtitle: {
    color: theme.text.secondary,
    fontSize: 13,
  },
  planPrice: {
    fontWeight: "bold",
    color: theme.text.primary,
  },
  subscribeButton: {
    marginTop: "auto",
    backgroundColor: theme.primary,
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
