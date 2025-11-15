import { View, Text } from "react-native";
import { useAuth } from "../services/AuthContext";

export default function ComentarioItem({ comentario, theme }) {
    const { session } = useAuth();

    // Función para calcular el tiempo transcurrido
    const calcularTiempoTranscurrido = (fecha) => {
        const ahora = new Date();
        const fechaComentario = new Date(fecha);
        const diferencia = ahora - fechaComentario;

        const minutos = Math.floor(diferencia / 60000);
        const horas = Math.floor(diferencia / 3600000);
        const dias = Math.floor(diferencia / 86400000);

        if (minutos < 1) return "hace unos segundos";
        if (minutos < 60) return `hace ${minutos}m`;
        if (horas < 24) return `hace ${horas}h`;
        if (dias < 7) return `hace ${dias}d`;

        return fechaComentario.toLocaleDateString("es-ES");
    };

    // Función para obtener la inicial del nombre
    const obtenerInicial = (nombre) => {
        return nombre ? nombre.charAt(0).toUpperCase() : "U";
    };

    const nombreUsuario = comentario.usuario?.nombre || "Usuario";
    const esUsuarioActual = comentario.usuario_id === session?.id;

    return (
        <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                    backgroundColor: theme.highlightBackground,
                    borderRadius: 12,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                }}
            >
                {/* Avatar circular con inicial */}
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: theme.primary,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: theme.text.primary,
                            fontSize: 18,
                            fontWeight: "bold",
                            fontFamily: theme.fonts.bold,
                        }}
                    >
                        {obtenerInicial(nombreUsuario)}
                    </Text>
                </View>

                {/* Contenido del comentario */}
                <View style={{ flex: 1 }}>
                    {/* Nombre y tiempo */}
                    <View style={{ flexDirection: "row", gap: 8, marginBottom: 4 }}>
                        <Text
                            style={{
                                fontFamily: theme.fonts.bold,
                                fontSize: 14,
                                color: theme.text.primary,
                            }}
                        >
                            {nombreUsuario}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: theme.text.secondary,
                                fontFamily: theme.fonts.regular,
                            }}
                        >
                            {calcularTiempoTranscurrido(comentario.created_at)}
                        </Text>
                    </View>

                    {/* Contenido del comentario */}
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.text.primary,
                            fontFamily: theme.fonts.regular,
                            lineHeight: 20,
                        }}
                    >
                        {comentario.mensaje}
                    </Text>
                </View>
            </View>
        </View>
    );
}
