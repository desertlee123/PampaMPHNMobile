import { View, Text } from "react-native";

export default function Info({autor, titulo, descripcion, theme}){
    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 16, fontFamily: theme.fonts.regular, color: theme.text.primary }}>
                {autor}
            </Text>
            <Text style={{ fontSize: 28, fontFamily: theme.fonts.bold, marginTop: 4, color: theme.text.primary }}>
                {titulo}
            </Text>
            <Text style={{ marginTop: 8, fontSize: 15, color: theme.text.primary, fontFamily: theme.fonts.regular }}>
                {descripcion}
            </Text>
            <View style={{ height: 16 }} />
        </View>
    );
}