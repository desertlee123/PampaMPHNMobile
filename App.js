import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "./assets/src/screens/Login";
import Signin from "./assets/src/screens/Signin";
import Home from "./assets/src/screens/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const readData = async () => {
    try {
      const val = await AsyncStorage.getItem("@token");
      const storedRole = await AsyncStorage.getItem("@role");
      if (val) setToken(val);
      if (storedRole) setRole(storedRole);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    readData();
  }, []);

  // useEffect que escucha cambios de token y recargua role
  // Esto “sincroniza” el rol cada vez que hay login o visitante
  useEffect(() => {
    if (token) {
      AsyncStorage.getItem("@role").then((storedRole) => {
        if (storedRole) setRole(storedRole);
      });
    }
  }, [token]);


  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <Home {...props} setToken={setToken} role={role} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <Login {...props} setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="Signin" options={{ headerShown: false }}>
              {(props) => <Signin {...props} setToken={setToken} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
