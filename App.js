import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./assets/src/screens/Login";
import Signin from "./assets/src/screens/Signin";
import Home from "./assets/src/screens/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // leer sesión guardada
  const readData = async () => {
    try {
      const stored = await AsyncStorage.getItem("@session");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSession(parsed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    readData();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session ? (
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => (
              <Home {...props} session={session} setSession={setSession} />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <Login {...props} setToken={setSession} />}
            </Stack.Screen>
            <Stack.Screen name="Signin" options={{ headerShown: false }}>
              {(props) => <Signin {...props} setToken={setSession} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
