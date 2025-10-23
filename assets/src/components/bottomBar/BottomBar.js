import { View } from "react-native";
import BottomBarButtom from "./buttons/BottonBarButton";


export default function BottomBar(){
    return (

        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '100%'}}>
            <BottomBarButtom text='Inicio'/>
            <BottomBarButtom text='Buscar'/>
            <BottomBarButtom text='Galeria'/>
            <BottomBarButtom text='Shorts'/>
            <BottomBarButtom text='Escanear'/>
        </View>

    );
}