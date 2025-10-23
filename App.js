import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getSession } from "./assets/src/services/storage"
import Login from "./assets/src/screens/Login";
import Signin from "./assets/src/screens/Signin";
import Home from "./assets/src/screens/Home";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider } from "./assets/src/services/AuthContext"; // Importamos el Contexto
import { validateSession } from "./assets/src/services/authService";

const Stack = createNativeStackNavigator();

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
    // Envolvemos la navegación y pasamos setSession aquí
    <AuthProvider setSession={setSession}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {session ? (
            // NO PASAMOS PROPS. Home obtendrá la sesión de su propio storage.
            <Stack.Screen name="Home" component={Home} />
          ) : (
            <>
              {/* NO PASAMOS PROPS. Login/Signin usarán el Context. */}
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signin" component={Signin} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
