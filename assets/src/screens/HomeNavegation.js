import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Articulo from "./Articulo";
import GaleriaAutor from "./GaleriaAutor";


export default function HomeNavegation() {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={Home} />
            <Stack.Screen name="Articulo" component={Articulo} />
            <Stack.Screen name="GaleriaAutor" component={GaleriaAutor} />
        </Stack.Navigator>
    );
}