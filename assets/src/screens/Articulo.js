// assets/src/screens/Articulo.js
import { View, Pressable, ScrollView, Text, Image, Dimensions, ActivityIndicator, Share } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { saveIcon, shareIcon } from "../../Icons";
import { useState, useEffect } from "react";
import { getArticuloPorId, saveArticulo, checkIfArticleSaved } from "../services/api";
import { useAuth } from "../services/AuthContext";
import Info from "../components/Info";
import Tabla from "../components/tabla/Tabla"
import Fila from "../components/tabla/Fila";
import MessageButton from "../components/MessageButton";

export default function Articulo() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const width = Dimensions.get("window").width;

    const { id } = route.params;

    const { session, setSession } = useAuth();
    const [loading, setLoading] = useState(true);
    const [articulo, setArticulo] = useState({
        autor: "Sin autor",
        titulo: "Sin titulo",
        descirpcion: "Sin descripción",
        id: null,
        fecha_publicacion: "00/00/0000",
        imageUrl: null,
        metadatos: null,
        para_socios: false,
    });
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    // Cargar artículo y verificar si está guardado
    useEffect(() => {
        const loadArticleData = async () => {
            try {
                setLoading(true);

                // Cargar datos del artículo
                const articleData = await getArticuloPorId(id);
                setArticulo(articleData);

                // Verificar si está guardado
                if (session?.token && session.token !== "VISITOR_MODE") {
                    const saved = await checkIfArticleSaved(id, session);
                    setIsSaved(saved);
                }

            } catch (error) {
                console.log("Error al cargar los artículos: ", error);
            } finally {
                setLoading(false);
            }
        };

        loadArticleData();
    }, [id, session]);

    // Función para guardar/desguardar artículo
    const handleSaveArticle = async () => {
        if (session?.role === 'visitor') {
            alert("Debes registrarte para guardar artículos");
            return;
        }

        if (!session?.token || session.token === "VISITOR_MODE") {
            alert("Debes iniciar sesión para guardar artículos");
            return;
        }

        try {
            setSaving(true);

            const result = await saveArticulo(articulo.id, session);

            if (result) {
                // Cambiar el estado basado en la respuesta del servidor
                setIsSaved(result.guardado);

                // Mostrar mensaje de feedback
                if (result.guardado) {
                    // Podrías mostrar un toast o feedback visual aquí
                    console.log("Artículo guardado");
                } else {
                    console.log("Artículo eliminado de guardados");
                }
            }

        } catch (error) {
            console.error("Error al guardar artículo:", error);
        } finally {
            setSaving(false);
        }
    };

    // Función para compartir el artículo
    const handleShare = async () => {
        try {
            const result = await Share.share({
                // El 'message' se usa en Android y como fallback en iOS
                message: `Mira este artículo: ${articulo.titulo}\n${articulo.imageUrl}`,

                // El 'url' es el contenido principal en iOS (si es una URL)
                url: articulo.imageUrl,

                // El 'title' se usa para el diálogo en Android
                title: articulo.titulo,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Compartido con un tipo de actividad específico (iOS)
                    console.log(`Compartido vía: ${result.activityType}`);
                } else {
                    // Compartido exitosamente (Android/iOS)
                    console.log("Compartido exitosamente");
                }
            } else if (result.action === Share.dismissedAction) {
                // El diálogo de compartir fue cerrado (Android/iOS)
                console.log("Diálogo de compartir cerrado");
            }
        } catch (error) {
            console.error("Error al compartir:", error.message);
        }
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#FFA500" />
            </View>
        );
    }

    if (session.role != 'partner' && articulo.para_socios) {
        console.log('role: ', session.role);

        switch (session.role) {
            case 'visitor':
                return (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text>Sesión no válida. Contenido exclusivo para socios</Text>
                        <Pressable onPress={() => setSession(null)}>
                            <Text style={{ color: "orange", marginTop: 10 }}>Registrarse</Text>
                        </Pressable>
                    </View>
                );
            case 'user':
                return (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text>Sesión no válida. Contenido exclusivo para socios.</Text>
                        <Pressable onPress={() => navigation.getParent().navigate("Suscripcion")}>
                            <Text style={{ color: "orange", marginTop: 10 }}>Volverse socio</Text>
                        </Pressable>
                    </View>
                );
        }
    }

    return (
        <>
            <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 10 }}>
                    {/* Botón compartir */}
                    <Pressable
                        style={{ marginRight: 20 }}
                        onPress={handleShare}
                    >
                        {shareIcon({ color: theme.text.primary })}
                    </Pressable>

                    {/* Botón guardar con estado visual */}
                    <Pressable
                        onPress={handleSaveArticle}
                        disabled={saving}
                        style={{
                            opacity: saving ? 0.6 : 1
                        }}
                    >
                        {saveIcon({
                            color: isSaved ? theme.primary : theme.text.primary,
                            fill: isSaved ? theme.primary : 'none'
                        })}
                    </Pressable>
                </View>

                <Info autor={articulo.autor} titulo={articulo.titulo} descripcion={articulo.descirpcion} theme={theme} />

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Pressable onPress={() => navigation.navigate("VistaDeImagen", { imageUrl: articulo.imageUrl })}>
                        <Image source={{ uri: articulo.imageUrl }} style={{ width: width - 28, height: width - 28, borderRadius: 16, resizeMode: 'contain' }} />
                    </Pressable>
                </View>

                {(articulo.metadatos) ?
                    <Tabla>
                        <Fila titulo="Autor" valor={articulo.metadatos.autor} theme={theme} />
                        <Fila titulo="Editor" valor={articulo.metadatos.editor} theme={theme} />
                        <Fila titulo="Proveedor de datos" valor={articulo.metadatos.proveedor_de_datos} theme={theme} />
                        <Fila titulo="Fecha creacion" valor={articulo.metadatos.fecha_creacion} theme={theme} />
                        <Fila titulo="Pais proveedor" valor={articulo.metadatos.pais_proveedor} theme={theme} />
                        <Fila titulo="Ultima actualizacion de proveedor" valor={articulo.metadatos.ultima_actualizacion_de_proveedor} theme={theme} />
                        <Fila titulo="Descripcion" valor={articulo.metadatos.descripcion} theme={theme} />
                        <Fila titulo="Created at" valor={articulo.metadatos.created_at} theme={theme} />
                        <Fila titulo="Updated at" valor={articulo.metadatos.updated_at} theme={theme} />
                    </Tabla>
                    : <Text>No hay metadatos</Text>
                }
            </ScrollView>
            <MessageButton navigation={navigation} theme={theme} id={articulo.id} />
        </>
    );
}
