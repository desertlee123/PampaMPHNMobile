import { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getSession } from "./assets/src/services/storage";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  View,
  Pressable,
} from "react-native";
import { AuthProvider } from "./assets/src/services/AuthContext";
import { validateSession } from "./assets/src/services/authService";
import { lightTheme } from "./assets/src/theme/colors";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";

import Login from "./assets/src/screens/Login";
import Signin from "./assets/src/screens/Signin";
import Home from "./assets/src/screens/Home";
import MiGaleria from "./assets/src/screens/MiGaleria";
import Shorts from "./assets/src/screens/Shorts";
import Buscar from "./assets/src/screens/Buscar";
import EscanearQR from "./assets/src/screens/EscanearQR";
import GaleriaAutor from "./assets/src/screens/GaleriaAutor";
import Perfil from "./assets/src/screens/Perfil";
import Notificaciones from "./assets/src/screens/Notificaciones";

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

// Header con los tres íconos
function HeaderRightIcons() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        marginLeft: "auto",
        gap: 20,
        marginRight: 10,
      }}
    >
      <Pressable onPress={() => navigation.navigate("Notificaciones")}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={lightTheme.text.primary}
        />
      </Pressable>
      <Pressable onPress={() => console.log("Toggle theme")}>
        <Ionicons
          name="moon-outline"
          size={24}
          color={lightTheme.text.primary}
        />
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Perfil")}>
        <Ionicons
          name="person-outline"
          size={24}
          color={lightTheme.text.primary}
        />
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

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const readData = async () => {
    try {
      const stored = await getSession();
      if (stored) {
        const valid = await validateSession();
        if (valid) setSession(valid);
        else setSession(null);
      } else setSession(null);
    } catch (e) {
      console.log("Error leyendo sesión: ", e);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {session ? (
            <Stack.Group>
              <Stack.Screen
                name="MainApp"
                options={{
                  headerShown: true,
                  title: "PAMPA MPHN",
                  headerTitleStyle: {
                    fontFamily: lightTheme.fonts.bold,
                    fontSize: 20,
                    color: lightTheme.text.primary,
                  },
                  headerStyle: { backgroundColor: lightTheme.cardBackground },
                  headerRight: () => <HeaderRightIcons />,
                }}
              >
                {() => (
                  <Tab.Navigator
                    screenOptions={{
                      headerShown: false,
                      tabBarActiveTintColor: lightTheme.tab.active,
                      tabBarInactiveTintColor: lightTheme.tab.inactive,
                      tabBarStyle: {
                        backgroundColor: lightTheme.tab.background,
                      },
                    }}
                  >
                    <Tab.Screen
                      name="Home"
                      component={Home}
                      options={{ tabBarIcon: homeIcons }}
                    />
                    <Tab.Screen
                      name="Mi galería"
                      component={MiGaleria}
                      options={{ tabBarIcon: galeriaIcons }}
                    />
                    <Tab.Screen
                      name="Shorts"
                      component={Shorts}
                      options={{ tabBarIcon: shortsIcons }}
                    />
                    <Tab.Screen
                      name="Buscar"
                      component={BuscarStackScreen}
                      options={{ tabBarIcon: buscarIcons }}
                    />
                    <Tab.Screen
                      name="Escanear QR"
                      component={EscanearQR}
                      options={{ tabBarIcon: escanearQRIcons }}
                    />
                  </Tab.Navigator>
                )}
              </Stack.Screen>

              <Stack.Screen
                name="Perfil"
                component={Perfil}
                options={{
                  headerShown: true,
                  title: "Mi Perfil",
                  headerTitleStyle: {
                    fontFamily: lightTheme.fonts.bold,
                    fontSize: 20,
                    color: lightTheme.text.primary,
                  },
                  headerStyle: { backgroundColor: lightTheme.cardBackground },
                }}
              />

              <Stack.Screen
                name="Notificaciones"
                component={Notificaciones}
                options={{
                  headerShown: true,
                  title: "Notificaciones",
                  headerTitleStyle: {
                    fontFamily: lightTheme.fonts.bold,
                    fontSize: 20,
                    color: lightTheme.text.primary,
                  },
                  headerStyle: { backgroundColor: lightTheme.cardBackground },
                }}
              />

              <Stack.Screen
                name="Suscripcion"
                component={require("./assets/src/screens/Suscripcion").default}
                options={{
                  headerShown: true,
                  title: "Suscripción",
                  headerTitleStyle: {
                    fontFamily: lightTheme.fonts.bold,
                    fontSize: 20,
                    color: lightTheme.text.primary,
                  },
                  headerStyle: { backgroundColor: lightTheme.cardBackground },
                }}
              />
            </Stack.Group>
          ) : (
            <Stack.Group>
              {/* Pantallas públicas */}
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signin" component={Signin} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
