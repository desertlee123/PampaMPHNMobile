// assets/src/screens/MiGaleria.js
import { View, Text, Button, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useAuth } from "../services/AuthContext"
import { useEffect, useState } from "react";
import { API_BASE_URL, IMAGE_BASE_URL } from "../services/Api";
import { useTheme } from "../theme/ThemeContext";
import Seccion from "../components/Seccion";
import Box from "../components/Box";

export default function MiGaleria() {
    const { session } = useAuth();
    const [misArticulos, setMisArticulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useTheme();
    const isFocused = useIsFocused();

    const navigation = useNavigation();

    const loadArticulosGuardados = async () => {
        // Verificar sesión antes de hacer la petición
        if (!session?.token) {
            setError("No hay sesión activa");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `${API_BASE_URL}/usuarios/articulos/guardados`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.token}`
                }
            });

            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }

            const data = await res.json();

            if (data.articulos) {
                const articulosProcesados = data.articulos.map(articulo => ({
                    ...articulo,
                    imageUrl: articulo.imagen ? `${IMAGE_BASE_URL}/${articulo.imagen}` : null
                }));
                setMisArticulos(articulosProcesados);
            } else {
                setMisArticulos([]);
            }

        } catch (error) {
            console.error("Error al cargar artículos guardados:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (session?.token && isFocused) {
            loadArticulosGuardados();
        } else if (!session?.token) {
            setError("No hay sesión activa");
            setLoading(false);
        }
    }, [session, isFocused]);

    const renderArticulo = ({ item }) => (
        <Box
            title={item.titulo}
            imageUrl={item.imageUrl}
            paraSocios={item.para_socios ? 1 : 0}
            esSocio={session?.role === 'socio'}
            onPress={() => navigation.navigate("Articulo", { id: item.id })}
            style={{
                marginHorizontal: 8,
                marginBottom: 16
            }}
        />
    );

    if (loading) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.text.primary }]}>
                    Cargando tus artículos guardados...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.errorText, { color: theme.error }]}>Error: {error}</Text>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Reintentar"
                        onPress={loadArticulosGuardados}
                        color={theme.primary}
                    />
                    <View style={styles.buttonSpacer} />
                    <Button
                        title="Ir a Home"
                        onPress={() => navigation.navigate("Home")}
                        color={theme.primary}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Seccion title="Mi Galería">
                <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
                    {misArticulos.length} artículo{misArticulos.length !== 1 ? 's' : ''} guardado{misArticulos.length !== 1 ? 's' : ''}
                </Text>
            </Seccion>

            {misArticulos.length === 0 ? (
                <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
                    <Text style={[styles.emptyText, { color: theme.text.primary }]}>
                        No tienes artículos guardados
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.text.secondary }]}>
                        Los artículos que guardes aparecerán aquí
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Explorar Artículos"
                            onPress={() => navigation.navigate("Home")}
                            color={theme.primary}
                        />
                    </View>
                </View>
            ) : (
                <FlatList
                    data={misArticulos}
                    renderItem={renderArticulo}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.gridContainer}
                    showsVerticalScrollIndicator={false}
                    style={styles.flatList}
                    refreshControl={null}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    gridContainer: {
        paddingBottom: 20,
    },
    flatList: {
        flex: 1,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    errorText: {
        marginBottom: 16,
        textAlign: 'center',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 16,
    },
    buttonSpacer: {
        height: 12,
    },
});
