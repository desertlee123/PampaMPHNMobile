import { View, Text } from "react-native";
import Constants from 'expo-constants'
import { Slot } from "expo-router";
import BottomBar from "../assets/src/components/bottomBar/BottomBar";

export default function Layout(){
    
    return (
        <View style={{flex: 1, width: '100%', backgroundColor: '#000'}}>
            <View style={{width: '100%', height: 40, backgroundColor: '#f00'}}>
                <Text>Header</Text>
            </View>
            <View style={{flex: 1, width: '100%', backgroundColor: '#0f0'}}>
                <Slot/>
            </View>
            <View style={{width: '100%', height: 100, backgroundColor: '#00f'}}>
                <BottomBar/>
            </View>
        </View>
    );
}