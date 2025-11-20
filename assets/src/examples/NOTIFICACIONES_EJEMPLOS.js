/**
 * EJEMPLOS AVANZADOS - Sistema de Notificaciones
 * 
 * Este archivo contiene ejemplos de cómo usar el sistema de notificaciones
 * en diferentes escenarios avanzados.
 */

// ========================================
// EJEMPLO 1: Usar notificaciones en un componente
// ========================================

import { View, Text } from "react-native";
import { useNotifications } from "../services/NotificationContext";
import { useTheme } from "../theme/ThemeContext";

function EjemploComponente() {
  const { notifications, loading } = useNotifications();
  const { theme } = useTheme();

  if (loading) {
    return <Text>Cargando notificaciones...</Text>;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ color: theme.text.primary, fontSize: 16, marginBottom: 10 }}>
        Tienes {notifications.length} notificaciones
      </Text>
      {notifications.map((notif) => (
        <Text key={notif.id} style={{ color: theme.text.secondary }}>
          • {notif.title}
        </Text>
      ))}
    </View>
  );
}

// ========================================
// EJEMPLO 2: Badge con contador en icono de notificaciones
// ========================================

import { Ionicons } from "@expo/vector-icons";

function HeaderNotificationBadge({ theme, notifications }) {
  return (
    <View style={{ position: "relative" }}>
      <Ionicons
        name="notifications-outline"
        size={24}
        color={theme.text.primary}
      />
      {notifications.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: -5,
            right: -8,
            backgroundColor: "#FF6B6B",
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {notifications.length > 99 ? "99+" : notifications.length}
          </Text>
        </View>
      )}
    </View>
  );
}

// ========================================
// EJEMPLO 3: Mostrar notificación flotante (Toast)
// ========================================

import { useEffect, useState } from "react";
import { Animated, Easing } from "react-native";

function NotificationToast({ notification, theme }) {
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    // Auto-hide después de 4 segundos
    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }, 4000);

    return () => clearTimeout(timer);
  }, [slideAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        backgroundColor: theme.cardBackground,
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: theme.primary,
        marginHorizontal: 16,
      }}
    >
      <Text style={{ color: theme.text.primary, fontWeight: "600" }}>
        {notification.title}
      </Text>
      <Text style={{ color: theme.text.secondary, fontSize: 12 }}>
        {notification.body}
      </Text>
    </Animated.View>
  );
}

// ========================================
// EJEMPLO 4: Filtrar notificaciones por tipo
// ========================================

function NotificacionesFiltradas() {
  const { notifications } = useNotifications();

  // Filtrar solo notificaciones recientes (menos de 24 horas)
  const notificacionesRecientes = notifications.filter((notif) => {
    const date = new Date(notif.date);
    const now = new Date();
    const diffHoras = (now - date) / (1000 * 60 * 60);
    return diffHoras < 24;
  });

  // Filtrar notificaciones que tienen URL
  const notificacionesConURL = notifications.filter((notif) => notif.data?.url);

  return (
    <View>
      <Text>Recientes: {notificacionesRecientes.length}</Text>
      <Text>Con enlace: {notificacionesConURL.length}</Text>
    </View>
  );
}

// ========================================
// EJEMPLO 5: Guardar notificación personalizada
// ========================================

import { saveNotification } from "../services/notificationService";

async function crearNotificacionPersonalizada() {
  const miNotificacion = {
    id: "custom-" + Date.now(),
    title: "Mi Notificación",
    body: "Esta es una notificación personalizada que creé",
    data: {
      tipo: "especial",
      url: "https://ejemplo.com",
    },
    date: new Date().toISOString(),
    read: false,
  };

  await saveNotification(miNotificacion);
  console.log("Notificación guardada");
}

// ========================================
// EJEMPLO 6: Escuchar cambios en notificaciones
// ========================================

import { useEffect } from "react";

function MonitorNotificaciones() {
  const { notifications } = useNotifications();

  useEffect(() => {
    if (notifications.length > 0) {
      console.log("Nueva notificación recibida:", notifications[0]);
      // Aquí puedes hacer algo cuando llega una notificación
      // Por ejemplo: reproducir sonido, mostrar animación, etc.
    }
  }, [notifications.length]); // Solo cuando cambia la cantidad

  return null;
}

// ========================================
// EJEMPLO 7: Sincronizar con servidor
// ========================================

async function sincronizarNotificacionesConServidor() {
  const { notifications } = useNotifications();

  // Enviar notificaciones leídas al servidor para marcar como leídas
  for (const notif of notifications) {
    if (notif.read) {
      try {
        await fetch("https://api.ejemplo.com/notificaciones/" + notif.id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });
      } catch (error) {
        console.error("Error sincronizando:", error);
      }
    }
  }
}

// ========================================
// EJEMPLO 8: Hook personalizado para límite de notificaciones
// ========================================

import { useEffect } from "react";
import { deleteNotification, getNotifications } from "../services/notificationService";

function useLimitarNotificaciones(maxNotificaciones = 50) {
  const { notifications } = useNotifications();

  useEffect(() => {
    if (notifications.length > maxNotificaciones) {
      // Eliminar las notificaciones más antiguas
      const paraEliminar = notifications.slice(maxNotificaciones);
      paraEliminar.forEach((notif) => {
        deleteNotification(notif.id);
      });
    }
  }, [notifications.length]);
}

// ========================================
// EJEMPLO 9: Categorizar notificaciones
// ========================================

function categorizarNotificaciones(notifications) {
  return {
    eventos: notifications.filter(
      (n) => n.data?.tipo === "evento" || n.title.includes("Evento")
    ),
    suscripcion: notifications.filter(
      (n) => n.data?.tipo === "suscripcion" || n.title.includes("Suscripción")
    ),
    sistemas: notifications.filter(
      (n) => n.data?.tipo === "sistema" || n.title.includes("Sistema")
    ),
    otras: notifications.filter(
      (n) =>
        n.data?.tipo !== "evento" &&
        n.data?.tipo !== "suscripcion" &&
        n.data?.tipo !== "sistema"
    ),
  };
}

// Uso:
function VistaCategorizada() {
  const { notifications } = useNotifications();
  const categorias = categorizarNotificaciones(notifications);

  return (
    <View>
      <Text>Eventos: {categorias.eventos.length}</Text>
      <Text>Suscripción: {categorias.suscripcion.length}</Text>
      <Text>Sistema: {categorias.sistemas.length}</Text>
      <Text>Otras: {categorias.otras.length}</Text>
    </View>
  );
}

// ========================================
// EJEMPLO 10: Búsqueda de notificaciones
// ========================================

function buscarNotificaciones(notifications, termino) {
  const termino_lower = termino.toLowerCase();
  return notifications.filter(
    (notif) =>
      notif.title.toLowerCase().includes(termino_lower) ||
      notif.body.toLowerCase().includes(termino_lower)
  );
}

// Uso en componente:
function PantallaBuscar() {
  const { notifications } = useNotifications();
  const [termino, setTermino] = useState("");

  const resultados = buscarNotificaciones(notifications, termino);

  return (
    <View>
      {/* Input de búsqueda aquí */}
      {resultados.map((notif) => (
        <Text key={notif.id}>{notif.title}</Text>
      ))}
    </View>
  );
}

export {
  EjemploComponente,
  HeaderNotificationBadge,
  NotificationToast,
  NotificacionesFiltradas,
  crearNotificacionPersonalizada,
  MonitorNotificaciones,
  sincronizarNotificacionesConServidor,
  useLimitarNotificaciones,
  categorizarNotificaciones,
  VistaCategorizada,
  buscarNotificaciones,
  PantallaBuscar,
};
