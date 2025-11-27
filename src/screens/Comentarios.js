import {
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
} from "react-native";

import { useState, useEffect, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { useAuth } from "../services/AuthContext";
import { getComentarios, crearComentario } from "../services/Api";
import ComentarioItem from "../components/ComentarioItem";
import { Ionicons } from "@expo/vector-icons";

export default function Comentarios() {
    const navigation = useNavigation();
    const route = useRoute();
    const { theme } = useTheme();
    const { session } = useAuth();
    const [text, setText] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const scrollViewRef = useRef(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const { id } = route.params;

    useEffect(() => {
        cargarComentarios();
    }, []);

    useEffect(() => {
        const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
            // Scroll al final cuando el teclado se muestra
            if (scrollViewRef.current) {
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 300);
            }
        });

        const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShow.remove();
            keyboardDidHide.remove();
        };
    }, []);

    const cargarComentarios = async () => {
        try {
            setLoading(true);
            const data = await getComentarios(id);
            setComentarios(data);
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnviarComentario = async () => {
        if (session.role === 'visitor') {
            alert("Debes iniciar sesión para comentar");
            return;
        }

        if (!text.trim()) {
            alert("Por favor, escribe un comentario");
            return;
        }

        if (text.length > 250) {
            alert("El comentario no puede exceder 250 caracteres");
            return;
        }

        try {
            setEnviando(true);
            const nuevoComentario = await crearComentario(text, id, session.id, session);

            if (nuevoComentario) {
                setText('');
                await cargarComentarios();
                alert("Tu comentario fue enviado a revisión y puede tardar alrededor de 24 horas en publicarse");
            }
        } catch (error) {
            console.error('Error al enviar comentario:', error);
        } finally {
            setEnviando(false);
        }
    };

    const renderComentario = ({ item }) => <ComentarioItem comentario={item} theme={theme} />;

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>

            {/* Lista de comentarios */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : comentarios.length === 0 ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: theme.text.secondary, fontSize: 14 }}>
                        No hay comentarios aún
                    </Text>
                </View>
            ) : (
                <FlatList
                    ref={scrollViewRef}
                    data={comentarios}
                    renderItem={renderComentario}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={true}
                    onEndReachedThreshold={0.1}
                />
            )}

            {/* KeyboardAvoidingView para el input - solo contiene el área de escritura */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
                keyboardVerticalOffset={0}
            >
                <View
                    style={{
                        borderTopWidth: 1,
                        borderTopColor: theme.border,
                        backgroundColor: theme.cardBackground,
                        padding: 12,
                        paddingBottom: Platform.OS === "android" ? 20 : 0,
                        flexDirection: "row",
                        paddingBottom: 50,
                        alignItems: "flex-end",
                        gap: 12,
                    }}
                >
                    <TextInput
                        placeholder="Máx 250 caracteres"
                        value={text}
                        onChangeText={setText}
                        maxLength={250}
                        multiline
                        placeholderTextColor={theme.text.secondary}
                        style={{
                            flex: 1,
                            fontSize: 14,
                            color: theme.text.primary,
                            backgroundColor: theme.input.background,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: theme.input.border,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            maxHeight: 80,
                            minHeight: 40,
                            fontFamily: theme.fonts.regular,
                        }}
                    />
                    <Pressable
                        onPress={handleEnviarComentario}
                        disabled={enviando || !text.trim()}
                        style={{
                            backgroundColor: text.trim() ? theme.primary : theme.input.border,
                            padding: 12,
                            borderRadius: 8,
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 0,
                        }}
                    >
                        {enviando ? (
                            <ActivityIndicator color={theme.text.inverse} size="small" />
                        ) : (
                            <Ionicons name="send" size={20} color={theme.text.inverse} />
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
