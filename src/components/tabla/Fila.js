import { View, Text } from "react-native";

export default function Fila({titulo, valor, theme}){
    return (
        <View style={{flex: 1, width: '100%', flexDirection:'row', borderBottomWidth: 1, borderBottomColor: theme.text.secondary, paddingBottom: 8, paddingTop: 24}}>
            <View style={{flex: 2}}>
                <Text style={{fontFamily: theme.fonts.bold, color: theme.text.primary, textAlign:'left'}}>{titulo}</Text>
            </View>
            <View style={{flex: 2}}>
                <Text style={{color: theme.text.primary, textAlign: 'left'}}>{valor}</Text>
            </View>
        </View>
    );
}