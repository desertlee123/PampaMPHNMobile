import { View } from "react-native";

export default function Tabla({children}){
    return (
        <View style={{flex: 1, flexDirection: 'column', padding: 24}}>
            {children}
        </View>
    );
}