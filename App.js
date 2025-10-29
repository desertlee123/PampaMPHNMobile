import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getSession } from "./assets/src/services/storage"

import Login from "./assets/src/screens/Login";
import Signin from "./assets/src/screens/Signin";
import Home from "./assets/src/screens/Home";
import Galeria from "./assets/src/screens/Galeria";
import Shorts from "./assets/src/screens/Shorts";
import Buscar from "./assets/src/screens/Buscar";
import EscanearQR from "./assets/src/screens/EscanearQR";

import { galeriaIcons, homeIcons, shortsIcons, buscarIcons, escanearQRIcons } from "./assets/Icons";

import { ActivityIndicator, View } from "react-native";
import { AuthProvider } from "./assets/src/services/AuthContext"; // Importamos el Contexto
import { validateSession } from "./assets/src/services/authService";
import { lightTheme } from './assets/src/theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // leer sesión guardada desde storage
  const readData = async () => {
    try {
      const stored = await getSession();

      if (stored) {
        const valid = await validateSession() // verifica con el backend
        if (valid) setSession(valid);
        else setSession(null);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.log("Error leyendo sesión: ", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    readData();
  }, []);

  if (loading) {
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
                name="AuthenticatedStack" 
                options={{ headerShown: false }}
              >
                {() => (
                  <Tab.Navigator 
                    screenOptions={{
                      tabBarActiveTintColor: lightTheme.tab.active,
                      tabBarInactiveTintColor: lightTheme.tab.inactive,
                      tabBarStyle: {
                        backgroundColor: lightTheme.tab.background
                      }
                    }}>
                    <Tab.Screen name="Home" component={Home} options={{tabBarIcon: homeIcons}}/>
                    <Tab.Screen name="Galeria" component={Galeria} options={{tabBarIcon: galeriaIcons}}/>
                    <Tab.Screen name="Shorts" component={Shorts} options={{tabBarIcon: shortsIcons}}/>
                    <Tab.Screen name="Buscar" component={Buscar} options={{tabBarIcon: buscarIcons}}/>
                    <Tab.Screen name="Escaner QR" component={EscanearQR} options={{tabBarIcon: escanearQRIcons}}/>
                  </Tab.Navigator>
                )}
              </Stack.Screen>
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signin" component={Signin} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
