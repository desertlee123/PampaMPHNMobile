import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function MiGaleria(){
    const navigation = useNavigation();
    return(
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 22, marginBottom: 20 }}>
                Galería
            </Text>
            <Button title="Ir a Home" onPress={() => navigation.navigate("Home")} />
        </View>
    );
}