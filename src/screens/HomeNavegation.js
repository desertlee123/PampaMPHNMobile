import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import GaleriaAutor from "./GaleriaAutor";
import Comentarios from "./Comentarios";
import Suscripcion from "./Suscripcion";


export default function HomeNavegation() {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={Home} />
            {/* <Stack.Screen name="Articulo" component={Articulo} /> */}
            <Stack.Screen name="GaleriaAutor" component={GaleriaAutor} />
            {/* <Stack.Screen name="VistaDeImagen" component={VistaDeImagen} /> */}
            <Stack.Screen name="Comentarios" component={Comentarios} />
            <Stack.Screen name="Suscripcion" component={Suscripcion} />
        </Stack.Navigator>
    );
}