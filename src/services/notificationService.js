import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OneSignal, LogLevel} from 'react-native-onesignal';

// Función para guardar notificaciones en AsyncStorage
export async function saveNotificationToStorage(notification) {
  try {
    const existing = await AsyncStorage.getItem('@notifications');
    const notifications = existing ? JSON.parse(existing) : [];
    
    const newNotification = {
      id: notification.notificationId || Date.now().toString(),
      title: notification.title || 'Notificación',
      body: notification.body || '',
      additionalData: notification.additionalData || {},
      launchURL: notification.launchURL || null,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    notifications.unshift(newNotification); // Agregar al inicio
    await AsyncStorage.setItem('@notifications', JSON.stringify(notifications));
    
    // console.log("Notificación guardada en AsyncStorage");
    // console.log("Total guardadas:", notifications.length);
    
    return newNotification;
  } catch (error) {
    console.error("Error guardando notificación:", error);
  }
}

export async function startNotifications(){
  try {
    // console.log("Inicializando OneSignal...");
    // console.log("ID OneSignal:", process.env.EXPO_PUBLIC_ONESIGNAL_ID);
    
    // Enable verbose logging for debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    
    // Initialize OneSignal
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_ID);
    
    // Request notification permission
    // console.log("Pidiendo permisos de notificaciones...");
    OneSignal.Notifications.requestPermission(true);
    
    // ===== LISTENER 1: Notificaciones en FOREGROUND (app abierta) =====
    // console.log("Configurando listener de notificaciones en foreground...");
    const unsubscribeForeground = OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      async (event) => {
        // console.log("¡Notificación recibida en PRIMER PLANO!");
        const notification = event.getNotification();
        // console.log("Detalles:", {
        //   id: notification.notificationId,
        //   title: notification.title,
        //   body: notification.body,
        // });

        Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.body,
          },
          trigger: null,
        });
        
        // Guardar en AsyncStorage
        await saveNotificationToStorage(notification);
        
        // Mostrar la notificación
        try {
          if (typeof event.complete === 'function') {
            event.complete(notification);
            // console.log("Notificación mostrada");
          }
        } catch (error) {
          console.error("Error al mostrar notificación:", error);
        }
      }
    );
    
    // // ===== LISTENER 2: Click en notificaciones =====
    // console.log("Configurando listener de clicks...");
    // const unsubscribeClick = OneSignal.Notifications.addEventListener(
    //   'click',
    //   (event) => {
    //     console.log("¡Notificación TOCADA!");
    //     const notification = event.getNotification();
    //     console.log("Detalles del click:", {
    //       id: notification.notificationId,
    //       title: notification.title,
    //       body: notification.body,
    //     });
        
    //     // Aquí puedes navegar a una pantalla específica si lo necesitas
    //     // navigation.navigate("MiPantalla", { data: notification });
    //   }
    // );
    
    // ===== LISTENER 3: Notificaciones recibidas (cualquier estado) =====
    // console.log("Configurando listener de notificaciones recibidas...");
    const unsubscribeReceived = OneSignal.Notifications.addEventListener(
      'notificationWillDisplay',
      async (event) => {
        // console.log("¡Notificación RECIBIDA (cualquier estado)!");
        const notification = event.getNotification();
        // console.log("Detalles:", {
        //   id: notification.notificationId,
        //   title: notification.title,
        //   body: notification.body,
        // });

        Notifications.scheduleNotificationAsync({
          content: {
            title: notification.title,
            body: notification.body,
          },
          trigger: null,
        });
        
        // Guardar en AsyncStorage
        await saveNotificationToStorage(notification);
      }
    );
    
    // console.log("OneSignal inicializado exitosamente");
    // console.log("Listeners activos: foreground + click + received");
    
  } catch (error) {
    console.error("Error al inicializar OneSignal:", error);
  }
}