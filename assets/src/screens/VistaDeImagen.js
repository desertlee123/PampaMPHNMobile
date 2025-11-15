// assets/src/screens/VistaDeImagen.js
import { View, Text, Image, Dimensions, Animated as RNAnimated } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import Header from "../components/Header";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import { useState, useRef } from "react";

export default function VistaDeImagen() {

    const route = useRoute();
    const navigation = useNavigation();
    const theme = useTheme();
    const width = Dimensions.get("window").width;

    const [scale, setScale] = useState(1);
    const lastScaleRef = useRef(1);

    const zoomGesture = Gesture.Pinch()
        .onUpdate((e) => {
            let newScale = lastScaleRef.current * e.scale;
            // Limitar el zoom entre 1 y 5
            if (newScale < 1) newScale = 1;
            if (newScale > 5) newScale = 5;
            setScale(newScale);
        })
        .onEnd(() => {
            // Asegurar que el scale esté dentro de los límites
            let finalScale = scale;
            if (finalScale < 1) {
                finalScale = 1;
                setScale(1);
            } else if (finalScale > 5) {
                finalScale = 5;
                setScale(5);
            }
            lastScaleRef.current = finalScale;
        });

    const { imageUrl } = route.params;

    return (
        <View style={{ flex: 1, backgroundColor: theme.cardBackground /* Fondo negro para la vista de imagen */ }}>
            <View style={{ width: "100%", height: "100%", flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                <GestureDetector gesture={zoomGesture}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={{
                            width: width,
                            height: width,
                            resizeMode: 'contain',
                            transform: [{ scale: scale }]
                        }}
                    />
                </GestureDetector>
            </View>
        </View>
    );
}