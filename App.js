// App.js
import { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";

import { AuthProvider } from "./assets/src/services/AuthContext";
import { getSession } from "./assets/src/services/storage";
import { validateSession } from "./assets/src/services/authService";
import { ThemeProvider, useTheme } from "./assets/src/theme/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Login from "./assets/src/screens/Login";
import Signin from "./assets/src/screens/Signin";
import HomeNavegation from "./assets/src/screens/HomeNavegation";
import MiGaleria from "./assets/src/screens/MiGaleria";
import Shorts from "./assets/src/screens/Shorts";
import Buscar from "./assets/src/screens/Buscar";
import EscanearQR from "./assets/src/screens/EscanearQR";
import Perfil from "./assets/src/screens/Perfil";
import GaleriaAutor from "./assets/src/screens/GaleriaAutor";
import Notificaciones from "./assets/src/screens/Notificaciones";
import Articulo from "./assets/src/screens/Articulo";
import VistaDeImagen from "./assets/src/screens/VistaDeImagen";
import Comentarios from "./assets/src/screens/Comentarios";

import {
  galeriaIcons,
  homeIcons,
  shortsIcons,
  buscarIcons,
  escanearQRIcons,
} from "./assets/Icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const BuscarStack = createNativeStackNavigator();

function HeaderRightIcons() {
  const { theme, toggleTheme, isDark } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: "row", gap: 20, marginRight: 12 }}>
      <Pressable onPress={() => navigation.navigate("Notificaciones")}>
        <Ionicons name="notifications-outline" size={24} color={theme.text.primary} />
      </Pressable>
      <Pressable onPress={toggleTheme}>
        <Ionicons
          name={isDark ? "sunny-outline" : "moon-outline"}
          size={24}
          color={theme.text.primary}
        />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Perfil")}>
        <Ionicons name="person-outline" size={24} color={theme.text.primary} />
      </Pressable>
    </View>
  );
}

function BuscarStackScreen() {
  return (
    <BuscarStack.Navigator screenOptions={{ headerShown: false }}>
      <BuscarStack.Screen name="BuscarMain" component={Buscar} />
      <BuscarStack.Screen name="GaleriaAutor" component={GaleriaAutor} />
    </BuscarStack.Navigator>
  );
}

function MainTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tab.active,
        tabBarInactiveTintColor: theme.tab.inactive,
        tabBarStyle: { backgroundColor: theme.tab.background, borderTopColor: theme.border },
      }}
    >
      <Tab.Screen name="Home" component={HomeNavegation} options={{ tabBarIcon: homeIcons }} />
      <Tab.Screen name="Mi galería" component={MiGaleria} options={{ tabBarIcon: galeriaIcons }} />
      <Tab.Screen name="Shorts" component={Shorts} options={{ tabBarIcon: shortsIcons }} />
      <Tab.Screen name="Buscar" component={BuscarStackScreen} options={{ tabBarIcon: buscarIcons }} />
      <Tab.Screen name="Escanear QR" component={EscanearQR} options={{ tabBarIcon: escanearQRIcons }} />
    </Tab.Navigator>
  );
}

function AppNavigator({ session, setSession }) {
  const { theme, isDark } = useTheme();

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <Stack.Group>
            <Stack.Screen
              name="MainApp"
              options={{
                headerShown: true,
                title: "PAMPA MPHN",
                headerTitleStyle: {
                  fontFamily: theme.fonts.bold,
                  fontSize: 20,
                  color: theme.text.primary,
                },
                headerStyle: { backgroundColor: theme.cardBackground },
                headerRight: () => <HeaderRightIcons />,
              }}
              component={MainTabs}
            />
            <Stack.Screen
              name="Perfil"
              component={Perfil}
              options={{
                headerShown: true,
                title: "Mi Perfil",
                headerTitleStyle: { color: theme.text.primary, fontFamily: theme.fonts.bold },
                headerStyle: { backgroundColor: theme.cardBackground },
              }}
            />
            <Stack.Screen
              name="Notificaciones"
              component={Notificaciones}
              options={{
                headerShown: true,
                title: "Notificaciones",
                headerTitleStyle: { color: theme.text.primary, fontFamily: theme.fonts.bold },
                headerStyle: { backgroundColor: theme.cardBackground },
              }}
            />
            <Stack.Screen
              name="Suscripcion"
              component={require("./assets/src/screens/Suscripcion").default}
              options={{
                headerShown: true,
                title: "Suscripción",
                headerTitleStyle: { color: theme.text.primary, fontFamily: theme.fonts.bold },
                headerStyle: { backgroundColor: theme.cardBackground },
              }}
            />
            <Stack.Screen
              name="Articulo"
              component={Articulo}
              options={{
                headerShown: true,
                title: "Artículo",
                headerTitleStyle: { color: theme.text.primary, fontFamily: theme.fonts.bold },
                headerStyle: { backgroundColor: theme.cardBackground },
              }}
            />
            <Stack.Screen
              name="VistaDeImagen"
              component={VistaDeImagen}
              options={{
                headerShown: true,
                title: "Imagen",
                headerTitleStyle: { color: theme.text.primary, fontFamily: theme.fonts.bold },
                headerStyle: { backgroundColor: theme.cardBackground },
              }}
            />
            <Stack.Screen
              name="Comentarios"
              component={Comentarios}
              options={{
                headerShown: true,
                title: "Comentarios",
                headerTitleStyle: { color: theme.text.primary, fontFamily: theme.fonts.bold },
                headerStyle: { backgroundColor: theme.cardBackground },
              }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signin" component={Signin} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  useEffect(() => {
    const readData = async () => {
      try {
        const stored = await getSession();
        if (stored) {
          const valid = await validateSession();
          if (valid) setSession(valid);
        }
      } finally {
        setLoading(false);
      }
    };
    readData();
  }, []);

  if (loading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <AuthProvider setSession={setSession}>
      <ThemeProvider>
        <GestureHandlerRootView>
          <AppNavigator session={session} setSession={setSession} />
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
  );
}
