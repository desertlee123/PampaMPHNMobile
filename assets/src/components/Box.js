import { View, Text, Image, Pressable } from "react-native"
import { useTheme } from "../theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function Box({ title, imageUrl, onPress, style, paraSocios, esSocio }) {
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

            {/* ⭐ Solo mostrar a socios, en artículos exclusivos */}
            {esSocio && paraSocios === 1 && (
                <View
                    style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        borderRadius: 20,
                        padding: 4,
                    }}
                >
                    <Ionicons name="star" size={18} color="#FFD700" />
                </View>
            )}

            <Text style={{ padding: 8, fontWeight: "600", textAlign: "center", color: theme.text.secondary }}>{title}</Text>
        </Pressable>
    );
}