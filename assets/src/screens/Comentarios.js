// assets/src/screens/Comentarios.js
import { View, Text, TextInput } from "react-native";
import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";

export default function Comentarios() {
    const navegation = useNavigation();
    const route = useRoute();
    const { theme } = useTheme();
    const [text, setText] = useState('');

    const { id } = route.params;

    return (
        <View style={{ flex: 1 }}>
            <Text>Comentarios</Text>
            <View style={{ flex: 10, backgroundColor: '#f00' }}></View>
            <View style={{ flex: 1, backgroundColor: '#0f0' }}>
                <TextInput
                    placeholder="Max 250 caracteres"
                    value={text}
                    onChangeText={setText}
                    placeholderTextColor={theme.text.primary}
                    style={{
                        flex: 1,
                        fontSize: 16,
                        color: theme.text.primary,
                        paddingVertical: 10,
                    }}
                />
            </View>
        </View>
    );
}
