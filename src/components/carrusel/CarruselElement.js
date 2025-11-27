// assets/src/components/carrusel/CarruselElement.js
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../../theme/ThemeContext"; // Importar el hook de tema si es necesario para colores dinámicos

export default function CarruselElement({ title, imageUrl }) {
    // Si estás usando ThemeContext en tu aplicación, puedes usar esto para colores
    // const { theme } = useTheme(); 

    return (
        <View style={styles.container}>
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                />

                {/* 1. Overlay semi-transparente oscuro para asegurar el contraste */}
                <View style={styles.titleOverlay}>
                    {/* 2. Título centrado y con color de alto contraste (blanco) */}
                    <Text style={styles.titleText}>{title}</Text>
                </View>
            </View>

            {/* Elimino el View de 10x10. La separación la maneja Carrusel.js (ItemSeparatorComponent) */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // Asegura que los hijos se corten si se salen de los bordes
        overflow: 'hidden',
        borderRadius: 16,
        // Define el ancho total del elemento (ajusté para que entre en la pantalla, puedes modificar 379/200)
        width: 379,
    },
    imageWrapper: {
        position: 'relative',
        // Asegura que el contenido del wrapper se ajuste al contenedor
        width: '100%',
        height: 200, // Alto fijo para la imagen
    },
    image: {
        width: '100%',
        height: '100%',
        // Ya no necesitamos marginBottom: 8 aquí, ni borderRadius si el contenedor lo tiene
    },
    titleOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // Color oscuro con opacidad (puedes ajustar 0.7)
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 10,
        paddingHorizontal: 8,
        // Opción de centrar el texto verticalmente dentro del overlay si no es de una sola línea
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        // Color blanco para alto contraste
        color: 'white',
        fontSize: 18, // Tamaño de fuente para mayor visibilidad
        fontWeight: 'bold', // Énfasis
        textAlign: 'center',
    },
});
