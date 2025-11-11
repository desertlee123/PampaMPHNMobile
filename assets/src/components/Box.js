import { View, Text, Image, Pressable } from "react-native"
import { useTheme } from "../theme/ThemeContext";

export default function Box({ title, imageUrl, onPress, style }) {
    const { theme } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={[ // Usamos un array para fusionar los estilos
                {
                    width: 160,
                    backgroundColor: theme.cardBackground,
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    marginBottom: 12,
                },
                style // Aplicamos el estilo personalizado para permitir 'flex: 1'
            ]}
        >
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: "100%", height: 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                />
            ) : (
                <View style={{ width: "100%", height: 120, backgroundColor: "#ccc" }} />
            )}
            <Text style={{ padding: 8, fontWeight: "600", textAlign: "center", color: theme.text.secondary }}>{title}</Text>
        </Pressable>
    );
}